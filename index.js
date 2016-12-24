var express = require('express');
var app = express();
var CryptoJS = require("crypto-js");
var key = '/MrM2lriuKuBhNeueYE=';

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.send('Refer to <a href="https://little-url.herokuapp.com/" target="_blank">FreeCodeCamp URL Shortener Microservice</a>.');
  res.end();
});

app.get(/^\/new\/(.*)$/, function(req, res) {
  // console.log(req.path);

  var origin = decodeURI(req.path).substr(5);
  // var short = CryptoJS.AES.encrypt(origin, key);
  var wordArray = CryptoJS.enc.Utf8.parse(origin);
  var short = CryptoJS.enc.Base64.stringify(wordArray);

  console.log(origin, ' -> ', short);

  var doc = {
    original_url: origin,
    short_url: req.protocol + '://' + req.get('host') + '/'
    + encodeURI(short)
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(doc));
  res.end();
});

app.get('/:shortUrl', function(req, res) {
  var short = decodeURI(req.params.shortUrl);
  // var origin = CryptoJS.AES.decrypt(short, key);
  var parsedWordArray = CryptoJS.enc.Base64.parse(short);
  var origin = parsedWordArray.toString(CryptoJS.enc.Utf8);

  console.log(short, ' -> ', origin);

  if (origin.toLowerCase().substr(0, 4) !== 'http') {
    console.log('prefix http://');
    origin = 'http://' + origin;
  }

  console.log(short, ' -> ', origin);

  res.redirect(origin);
  res.end();
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
