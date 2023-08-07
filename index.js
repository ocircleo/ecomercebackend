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
const phoneDetaillLinks = [
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-12-4g/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-12c/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-a1-plus/",
  "https://www.gsmarena.com.bd/xiaomi-a1/",
  "https://www.gsmarena.com.bd/xiaomi-mix-fold-2/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-10a/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-10c/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-10-2022/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-11s/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-11/",
  "https://www.gsmarena.com.bd/xiaomi-12-pro/",
  "https://www.gsmarena.com.bd/xiaomi-11i-hypercharge/",
  "https://www.gsmarena.com.bd/xiaomi-poco-c31/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-9-activ/",
  "https://www.gsmarena.com.bd/xiaomi-11-lite-5g-ne/",
  "https://www.gsmarena.com.bd/xiaomi-11t-pro/",
  "https://www.gsmarena.com.bd/xiaomi-11t/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-10-prime/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-10/",
  "https://www.gsmarena.com.bd/xiaomi-pad-5/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-8-2021/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-9-dual-camera-version/",
  "https://www.gsmarena.com.bd/xiaomi-mi-11x/",
  "https://www.gsmarena.com.bd/xiaomi-poco-m2-reloaded/",
  "https://www.gsmarena.com.bd/xiaomi-poco-m3-pro-5g/",
  "https://www.gsmarena.com.bd/xiaomi-poco-x3-pro/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-10-pro/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-10s/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-10-pro-max/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-9-power/",
  "https://www.gsmarena.com.bd/xiaomi-poco-m3/",
  "https://www.gsmarena.com.bd/xiaomi-poco-c3/",
  "https://www.gsmarena.com.bd/xiaomi-poco-m2-pro/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-9a/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-10-pro-india/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-9/",
  "https://www.gsmarena.com.bd/xiaomi-redmi-note-9/",
];
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
      // if (phoneDetaillLinks.length > 0) return res.send(phoneDetaillLinks);
      // const result = await axios(url).then((res) => {
      //   const html = res.data;
      //   let $ = cheerio.load(html);
      //   const cards = $(".product-thumb", html);
      //   cards.each(function () {
      //     const cardImage = $(this).find("a:first");
      //     const cardDetaillLInk = cardImage.attr("href");
      //     phoneDetaillLinks.push(cardDetaillLInk);
      //   });
      // });
      res.send("ola");
      // =====ggd
      // const detaillResult = await axios(phoneDetaillLinks[0]).then((res) => {
      //   const htmlD = res.data;
      //   const $ = cheerio.load(htmlD);

      //   const table = $(".table_specs", htmlD);
      //   table.each(function () {
      //     const tableBody = $(this).find("tbody");
      //     tableBody.each(function () {
      //       const tr = $(this).find("tr");
      //       tr.each(function () {
      //         const name = $(this).find("td:first").text();
      //         const value = $(this).find("td:last").text();
      //         tableArray.push({ name, value });
      //       });
      //     });
      //   });
      // });
      res.send(tableArray);
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
