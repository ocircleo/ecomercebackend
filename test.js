const xxx = { name: "salman", value: "ok" };
let s = xxx.name;
let ddd = {
  [xxx.name]: xxx.value,
};
console.log(ddd);
