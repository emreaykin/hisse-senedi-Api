const express = require("express");
const puppeteer = require("puppeteer");
let app = express.Router();



app.get("/", function (req, res) {
  var spotHisse = [];

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://finans.mynet.com/borsa/canliborsa/"); //sitenin url

 var interval=   setInterval(async () => {
      
      const sayfasonu = await page.evaluate(
        () => document.getElementById("anlikBorsaData").offsetHeight
      );
      if (sayfasonu > 3000) {
        clearInterval(interval);
        const data = await page.evaluate(() =>
          Array.from(
            document.querySelectorAll('tr[class="sortTR"]>td'),
            (e) => e.innerText
          )
        );
        let index = 0;
        for (i = 0; i < data.length; i += 14) {
          index++;
          spotHisse[index] = {
            sembol: data[i + 1],
            alis: data[i + 4],
            satis: data[i + 5],
            zaman: data[i + 12],
          };
        }
        res.send(spotHisse);
      }else{
        await page.evaluate(() => window.scrollTo(0, 4000));
      }
    }, 1000);

  

})();
  
});

app.post("/", function (req, res) {
  res.send(JSON.stringify(format));
  //console.log(price_impact_result);
  // console.log(ilkfiyat);
});

module.exports = app;
