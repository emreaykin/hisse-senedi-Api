const express = require("express");
const puppeteer = require("puppeteer");
let app = express.Router();



app.get("/", function (req, res) {
  var spotHisse = [];
(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.oyakyatirim.com.tr/viop"); //sitenin url
    const data = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("tr:nth-child(53) ~ tr>td"),
        (e) => e.innerText
      )
    );
    const time = await page.evaluate(() =>
      Array.from(document.querySelectorAll('ul[class="blog-info"]>li'), (e) =>
        e.innerText.replace(" Son güncelleme: ", "")
      )
    );

    let index = 0;
    for (i = 0; i < data.length; i += 7) {
      index++;
      var alis = parseFloat(data[i + 4].replace(",", ".")).toFixed(2);
      var satis = parseFloat(data[i + 5].replace(",", ".")).toFixed(2);
      spotHisse[index] = {
        sembol: data[i],
        alis: alis,
        satis: satis,
        time: time[0],
      };
    }
    res.send(spotHisse);
})();
 
});

app.post("/", function (req, res) {
  res.send(JSON.stringify(format));
});

module.exports = app;
