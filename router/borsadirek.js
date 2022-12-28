const express = require("express");
const puppeteer = require("puppeteer");
let app = express.Router();


app.get("/", function (req, res) {
  var spotHisse = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.borsadirekt.com/canli-piyasa/bist"); //sitenin url

  await page.evaluate(() => changeIndex("XUTUM"));

 
    const sembol = await page.evaluate(() =>
      Array.from(
        document.getElementsByClassName("bodyBistSymbol2"),
        (e) => e.innerText
      )
    );
    const fiyat = await page.evaluate(() =>
      Array.from(
        document.getElementsByClassName("bodyBistPrice"),
        (e) => e.innerText
      )
    );
    const zaman = await page.evaluate(() =>
      Array.from(
        document.getElementsByClassName("bodyBistTime"),
        (e) => e.innerText
      )
    );

    for (i = 0; i < sembol.length; i++) {
      spotHisse[i] = { sembol: sembol[i], fiyat: fiyat[i], zaman: zaman[i] };
    }
    res.send(spotHisse);
})();
 
});

app.post("/", function (req, res) {
  res.send(JSON.stringify(format));
  //console.log(price_impact_result);
  // console.log(ilkfiyat);
});

module.exports = app;
