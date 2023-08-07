const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const port = process.env.port || 1111;
// middle werr
app.use(cors());
app.use(express.json());
require("dotenv").config();
const tableArray = [];
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ocircleo.zgezjlp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const phones = client.db("phones").collection("phone");
    app.get("/", async (req, res) => {
      // const url = "https://www.gsmarena.com.bd/xiaomi/";
      res.send("ola");
    });
    app.get("/scrapePhones", async (req, res) => {
      const { link } = req.query;
      const cardLinks = [];
      const result = await axios(link).then((res) => {
        const html = res.data;
        let $ = cheerio.load(html);
        const cards = $(".product-thumb", html);
        cards.each(function () {
          const cardImage = $(this).find("a:first");
          const cardDetaillLink = cardImage.attr("href");
          cardLinks.push(cardDetaillLink);
        });
        return cardLinks;
      });
      res.send(result);
    });

    app.get("/scrapePhoneDetaill", async (req, res) => {
      const { link } = req.query;
      const detaill = {};
      const detaillResult = await axios(link)
        .then((res) => {
          const html = res.data;
          const $ = cheerio.load(html);
          const table = $(".table_specs", html);
          table.each(function () {
            const tableBody = $(this).find("tbody");
            tableBody.each(function () {
              const tr = $(this).find("tr");
              tr.each(function () {
                const name = $(this).find("td:first").text();
                const value = $(this).find("td:last").text();
                detaill[name] = value;
              });
            });
          });
          return detaill;
        })
        .catch((error) => {
          if (error) return res.send("ola amiogos");
        });
      res.send(detaillResult);
    });

    // inserting data
    app.post("/addata", async (req, res) => {
      const data = req.body;
      const result = await phones.insertOne(data);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("app is running at port 111");
});
