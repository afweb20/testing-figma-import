const PORT = 7000;

var express = require("express");
var app = express();
var axios = require("axios");
var path = require('path');

app.post("/:project_id/:node_id/:type", function (req, res) {

  var projectId = req.params.project_id;
  var nodeId = req.params.node_id;
  var type = req.params.type;

  axios.post('http://localhost:8000/' + projectId + '/' + nodeId + '/' + type, {}).then(function (response) {
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