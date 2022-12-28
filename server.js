var bodyParser = require("body-parser");

var express = require("express");
var app = express();
const cors = require('cors');
const borsadirek = require('./router/borsadirek')
const hisse = require('./router/hisse')
const viop = require('./router/viop')
const viopTeminat = require('./router/viopTeminat')
const arbitrage = require('./router/arbitrage')
const port = process.env.PORT | 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/borsadirek',borsadirek)
app.use('/hisse',hisse)
app.use('/viop',viop)
app.use('/viopTeminat',viopTeminat)
app.use('/arbitrage',arbitrage)
// error handler
app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});