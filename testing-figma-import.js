const PORT = 7000;

var express = require("express");
var app = express();
var axios = require("axios");
var path = require('path');

app.post("/:figma_token/:project_id/:node_id", function (req, res) {

  var figmaToken = req.params.figma_token;
  var projectId = req.params.project_id;
  var nodeId = req.params.node_id;

  axios.post('http://localhost:8000/' + figmaToken + '/' + projectId + '/' + nodeId, {}).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    console.error(error);
  });

});

app.get("/:task_id", function (req, res) {

  var taskId = req.params.task_id;

  axios.get('http://localhost:8000/' + taskId, {}).then(function (response) {
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