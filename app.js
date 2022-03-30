const Insta = require("node-insta-web-api");
const express = require("express");
const app = express();
const InstaClient = new Insta();
const fs = require("fs");
const moment = require('moment');
const path = require("path");
const jimp = require("jimp");
const axios = require("axios");
const cron = require("node-cron");
const port = process.env.PORT || 3000;

require('dotenv').config();

console.log(`[${moment().format("HH:mm:ss")}]`)


cron.schedule("00 20 * * *", async () => {

(async()=>{

  function apiCall() {
    const promise = axios.get("https://dog.ceo/api/breeds/image/random")
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

  function quoteApi() {
    const promise = axios.get("https://api.quotable.io/random")
    const quote = promise.then((response) => response.data)

    return quote
}

var url = await apiCall();

var quote = await quoteApi();

  jimp.read(url['message'],(err,lenna)=>{
    if(err) throw err;
    lenna
    .write('./tesst.jpg');
  });

  console.log("Logging In....");
  await InstaClient.login(process.env.INSTAGRAM_USERNAME,process.env.INSTAGRAM_PASSWORD);
  await InstaClient.getCookie()
  const photo = path.join(__dirname, 'tesst.jpg');
  await InstaClient.useExistingCookie();
  console.log("Log in successfully ...");
  const caption = `${quote['content']} \nAuthor : ${quote['author']}`
  const resultAddPost = await InstaClient.addPost(photo,caption);
  fs.unlinkSync(`tesst.jpg`);
})();
});

app.listen(port,()=>{
  console.log(`Listening On ${port}`);
})