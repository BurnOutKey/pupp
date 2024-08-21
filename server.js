const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8080
const app = express();

const Puppeteer = require("./pupp.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const puppeteer = new Puppeteer();
puppeteer.run();

app.get(`/restart`, async (request, response) => {
  puppeteer.run();
});

app.get(`/token`, async (request, response) => {
  let { amount } = request.query;
  if (!amount) amount = 1;

  const Tokens = [];

  for (let i = 0; i < amount; i += 1) Tokens.push(await puppeteer.getToken());

  const Msg = JSON.stringify(Tokens);
  response.send(Msg);
});

const listener = app.listen(port, () => {
  console.log(`Your app is listening on port 8081`);
});