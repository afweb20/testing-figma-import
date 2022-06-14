var head = document.getElementsByTagName("head")[0];
var figmaImportMain = document.getElementById("figma-import-main");
var figmaImportButton = document.getElementById("figma-import-button");
var figmaImportUrl = document.getElementById("figma-import-url");
var figmaImportToken = document.getElementById("figma-import-token");
var figmaImportAlertWrongUrl = document.getElementById("figma-import-alert-wrong-url");
var figmaImportSelect = document.getElementById("figma-import-select");
var figmaImportLoader = document.getElementById("figma-import-loader");
var figmaImportLoaderText = document.getElementById("figma-import-loader-text");
var figmaImportContent = document.getElementById("figma-import-content");
var loadedFontsString = "";

figmaImportButton.addEventListener("click", function (event) {

  figmaImportLoader.classList.remove("visually-hidden");

  figmaImportPostReq();

});


var figmaImportPostReq = function () {

  var url = getFigmaImportUrlObject();

  var urlString = "/" + url.xfigmatoken + "/" + url.fileid + "/" + url.nodeid + "/" + url.type;
  var http = new XMLHttpRequest();

  http.open("POST", urlString, true);
  http.onreadystatechange = function () {

    if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {

      var resp = JSON.parse(http.response);
      figmaImportLoader.classList.remove("visually-hidden");
      figmaImportLoaderText.innerHTML = "Загружено на 0%";
      figmaImportMain.classList.add("visually-hidden");

      if (resp) {
        if (resp.state) {
          if (resp.state == "pending") {
            if (resp.task_id) {

              figmaImportGetReq(resp.task_id);

            }
          }
          if (resp.state == "completed") {
            figmaImportWriteContent(resp);
          }
        }
      }

    }
  };
  http.send(null);
  

};


var figmaImportWriteContent = function (resp) {

  figmaImportLoader.classList.add("visually-hidden");
  figmaImportMain.classList.add("visually-hidden");

  if (resp.result.type == "html") {

    figmaImportContent.innerHTML = resp.result.content;

  } else {

    figmaImportContent.innerHTML = JSON.stringify(resp.result.content);

  }

  if (resp.result.fonts) {

    if (resp.result.fonts.length > 0) {

      addLoadedFontsToHead(resp.result.fonts);

    }

  }

};


var figmaImportGetReq = function (task_id) {


  var intvl = setInterval(function () {

  var urlString = "/" + task_id;
  var http = new XMLHttpRequest();

  http.open("GET", urlString, true);
  http.onreadystatechange = function () {

    if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {

      var resp = JSON.parse(http.response);

      if (resp) {
        if (resp.state) {
          if (resp.state == "completed") {
            clearInterval(intvl);
            figmaImportWriteContent(resp);
          }
        }
        figmaImportLoaderText.innerHTML = "Загружено на " + resp.status + "%";
      }

    }
  };
  http.send(null);

}, 1000);

};


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
  var xfigmatoken = figmaImportToken.value;
  
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
    type: resultType,
    xfigmatoken: xfigmatoken
  };

  return url;

};


// подгрузка шрифтов
var addLoadedFontsToHead = function (fonts) {

  for (var i = 0; i < fonts.length; i++) {

    var font = fonts[i];

    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    link.href = "https://fonts.googleapis.com/css2?family=" + font + ":ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&&display=swap";

  }


};