const PORT = 7000;

var express = require("express");
var app = express();
var axios = require("axios");

// app.get("/sitecontent", function (req, res) {

//   // получение sitecontent 
//   axios.get('http://localhost:8000/vfcLzhPe3Aowdak3AZPXK8/636:3/sitecontent', {}).then(function (response) {
//     console.log(response);
//     res.send(response.data);
//   }).catch(function (error) {
//     console.error(error);
//   });

// });

app.set('view engine', 'pug');

app.get("/", function (req, res) {
  res.render("index", {title: "Hey!", message: "hello"});
});

app.listen(PORT, function () {
  console.log("Express is listening at port: " + PORT);
});