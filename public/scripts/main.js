var figmaImportButton = document.getElementById("figma-import-button");
var figmaImportUrl = document.getElementById("figma-import-url");
var figmaImportToken = document.getElementById("figma-import-token");
var figmaImportAlertWrongUrl = document.getElementById("figma-import-alert-wrong-url");
var figmaImportSelect = document.getElementById("figma-import-select");


figmaImportButton.addEventListener("click", function (event) {

  var url = getFigmaImportUrlObject();

  var urlString = "/" + url.fileid + "/" + url.nodeid + "/" + url.type;
  var http = new XMLHttpRequest();

  http.open("POST", urlString, true);
  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      console.log(http.response);
      // debugger;
    }
  };
  http.send(null);
  

});


var isValidHttpUrl = function (string) {

  var url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";

};


var getFigmaImportUrlObject = function () {

  var linkIsCorrect = true;
  var fileId = null;
  var nodeId = null;
  var resultType = "html";

  if (figmaImportUrl.value && !isValidHttpUrl(figmaImportUrl.value)) {

    linkIsCorrect = false;

  }

  if (!linkIsCorrect) {

    figmaImportAlertWrongUrl.classList.remove("visually-hidden");

    return false;

  } else {

    figmaImportAlertWrongUrl.classList.add("visually-hidden");

  }

  var value = figmaImportUrl.value;
  
  var regexFileId = /\/file\/([a-z0-9A-Z]+\/)/g;
  var matchFileId = value.match(regexFileId);

  if (matchFileId) {
    fileId = matchFileId[0].replace(regexFileId, "$1").replace("/", "");
  }

  var regexNodeId = /node-id=([a-z0-9A-Z%:]+)/g;
  var matchNodeId = value.match(regexNodeId); 

  if (matchNodeId) {
    nodeId = matchNodeId[0].replace(regexNodeId, "$1");
  }

  if (figmaImportSelect) {
    if (figmaImportSelect.value) {
      resultType = figmaImportSelect.value;
    }
  }

  var url = {
    fileid: fileId,
    nodeid: nodeId,
    type: resultType
  };

  return url;

};