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
const puppeteer = require("puppeteer");

const url =
  "https://boredhumans.com/art.php";

const port = process.env.PORT || 3000;

require("dotenv").config();

console.log(`[${moment().format("HH:mm:ss")}]`);

cron.schedule("00 20 * * *", async () => {
  (async () => {


      const arr = ["fanart","art","deviantart","paint","gallery","pop art","wall art","art gallery"]
      const random = Math.floor(Math.random() * 8)

      const keyword = arr[random];
      const URL = "https://www.all-hashtag.com/hashtag-generator.php";
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      await page.goto(URL);
      const hmm = await page.$("#keyword");
      await hmm.type(keyword);
      const test2 = await (await page.$("#header-gen-form > button")).click();
      const element = await page.waitForSelector('#copy-hashtags-similar'); 
      const value = await element.evaluate(el => el.textContent);
      await browser.close();

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
    const caption = `${quote["content"]} \nAuthor : ${quote["author"]} \n ${value}`;
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

