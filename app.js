const Insta = require("node-insta-web-api");
const express = require("express");
const app = express();
const InstaClient = new Insta();
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const jimp = require("jimp");
const axios = require("axios");
const cron = require("node-cron");
const request = require("request-promise");
const cheerio = require("cheerio");

const url =
  "https://boredhumans.com/art.php";

const port = process.env.PORT || 3000;

require("dotenv").config();

console.log(`[${moment().format("HH:mm:ss")}]`);

cron.schedule("00 20 * * *", async () => {
  (async () => {

    function quoteApi() {
      const promise = axios.get("https://api.quotable.io/random");
      const quote = promise.then((response) => response.data);

      return quote;
    }

    var quote = await quoteApi();

    const response = await request({
      uri: url,
    });
  
    let $ = cheerio.load(response);
  
    let test = $("#model-output > img")[0]["attribs"]["src"];

    jimp.read(test, (err, lenna) => {
      if (err) throw err;
      lenna.write("./tesst.jpg");
    });

    console.log("Logging In....");
    await InstaClient.login(
      process.env.INSTAGRAM_USERNAME,
      process.env.INSTAGRAM_PASSWORD
    );
    await InstaClient.getCookie();
    const photo = path.join(__dirname, "tesst.jpg");
    await InstaClient.useExistingCookie();
    console.log("Log in successfully ...");
    const caption = `${quote["content"]} \nAuthor : ${quote["author"]}`;
    const resultAddPost = await InstaClient.addPost(photo, caption);
    fs.unlinkSync(`tesst.jpg`);
  })();
});

app.get("/", (req, resp) => {
  resp.send("Working");
});

app.listen(port, () => {
  console.log(`Listening On ${port}`);
});
