const PORT = 7000;

var express = require("express");
var app = express();
var axios = require("axios");
var path = require('path');

app.post("/sitecontent", function (req, res) {

  // получение sitecontent 
  axios.post('http://localhost:8000/vfcLzhPe3Aowdak3AZPXK8/636:3/sitecontent', {}).then(function (response) {
    console.log(response);
    res.send(response.data);
  }).catch(function (error) {
    console.error(error);
  });

});

app.post("/html", function (req, res) {

  // получение html 
  axios.post('http://localhost:8000/vfcLzhPe3Aowdak3AZPXK8/636:3/html', {}).then(function (response) {
    console.log(response);
    res.send(response.data);
  }).catch(function (error) {
    console.error(error);
  });

});

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.render("index", { title: "Hey!", message: "Figma Import Testing" });
});

app.listen(PORT, function () {
  console.log("Express is listening at port: " + PORT);
});