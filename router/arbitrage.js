const express = require("express");
const puppeteer = require("puppeteer");
let app = express.Router();

app.get("/", function (req, res) {
  var spotHisse = [];
  var spotStatus = false;
  var viopHisse = [];
  var viopStatus = false;
  var viopTeminat = [];
  var viopTeminatStatus = false;
  var Arbitrage = [];

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://finans.mynet.com/borsa/canliborsa/"); //sitenin url
    spotStatus = false;

    var interval = setInterval(async () => {
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
        spotStatus = true;
      } else {
        await page.evaluate(() => window.scrollTo(0, 4000));
      }
    }, 1000);
  })();

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.oyakyatirim.com.tr/viop"); //sitenin url
    viopStatus = false;
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
      viopHisse[index] = {
        sembol: data[i],
        alis: alis,
        satis: satis,
        time: time[0],
      };
    }
    viopStatus = true;
    await browser.close();
  })();

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://www.alanyatirim.com.tr/tr-TR/guncel-viop-teminat-oranlari/627904"
    ); //sitenin url

    viopTeminatStatus = false;
    const data = await page.evaluate(() =>
      Array.from(document.querySelectorAll("tr >td"), (e) => e.innerText)
    );

    let index = 0;
    for (i = 62; i < data.length; i += 5) {
      index++;
      var hisse = data[i + 1];
      var teminat = data[i + 3].replace(",", "").replace("TL", "").trim();
      var kaldıraç = data[i + 4];
      viopTeminat[index] = {
        sembol: hisse,
        teminatbedeli: teminat,
        kaldirac: kaldıraç,
        // time:time[0]
      };
    }
    viopTeminat = true;

    await browser.close();
  })();


var inter=  setInterval(() => {
    if(viopStatus==true && spotStatus==true && viopTeminatStatus==true){
       for(let i =0;viopHisse.length;i++){
        let count = spotHisse.find(el => el.code === viopTeminat[i].sembol);
        let countt = spotHisse.find(el => el.code === viopHisse[i].sembol.replace(/F_|0|1|2|3/g,''));
        if(count!=undefined && countt!=undefined){
            Arbitrage[i] = {
                spotName:count['name'],
                spotAl:count['alis'],
                spotSat:count['satis'],
                vadeliName:viopHisse[i].sembol,
                vadeliAl:viopHisse[i].alis,
                vadeliSat:viopHisse[i].satis,
                vadeliTeminat:viopTeminat[i].teminatbedeli,
                kaldirac:viopTeminat[i].kaldirac,
             
              };
        }
       }
       clearInterval(inter);
       res.send(Arbitrage)
    }
  }, 3000);
});

app.post("/", function (req, res) {
  res.send(JSON.stringify(format));
  //console.log(price_impact_result);
  // console.log(ilkfiyat);
});

module.exports = app;
