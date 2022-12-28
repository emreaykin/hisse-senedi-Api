const express = require("express");
const puppeteer = require("puppeteer");
let app = express.Router();



app.get("/", function (req, res) {
  var spotHisse = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.alanyatirim.com.tr/tr-TR/guncel-viop-teminat-oranlari/627904"
  ); //sitenin url

  const data = await page.evaluate(() =>
    Array.from(document.querySelectorAll("tr >td"), (e) => e.innerText)
  );

  let index = 0;
  for (i = 62; i < data.length; i += 5) {
    index++;
    var hisse = data[i + 1];
    var teminat = data[i + 3].replace(",", "").replace("TL", "").trim();
    var kaldıraç = data[i + 4];
    spotHisse[index] = {
      sembol: hisse,
      teminatbedeli: teminat,
      kaldirac: kaldıraç,
      // time:time[0]
    };
  }
  res.send(spotHisse);
 
 

  //await browser.close();
})();

});

app.post("/", function (req, res) {
  res.send(JSON.stringify(format));
  //console.log(price_impact_result);
  // console.log(ilkfiyat);
});

module.exports = app;
