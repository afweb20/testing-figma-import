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

  // figmaImportLoader.classList.remove("visually-hidden");

  // figmaImportPostReq();
  figmaImportForu();

});

var figmaImportForu = function () {

  var urlStringImage = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/67faf582-cdd0-461e-bafd-64ec69a3e8e0";
  var xhr = new XMLHttpRequest();

  xhr.open("GET", urlStringImage, true);
  xhr.responseType = "blob";
  xhr.onreadystatechange = function () {

    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {

      // var resp = JSON.parse(http.response);
      var image = xhr.response;

      // var buffer = xhr.response;
      // // var file = xhr.response;
      console.log("image", image);

      // var binary = '';
      // var bytes = new Uint8Array( buffer );
      // var len = bytes.byteLength;
      // for (var i = 0; i < len; i++) {
      //     binary += String.fromCharCode( bytes[ i ] );
      // }
      // console.log(window.btoa( binary ));


      // var reader = new FileReader();

      // reader.onloadend = function () {

        // var id = "blobid" + (new Date()).getTime();

        // var image = reader.result;

      var urlString = "http://localhost:3000/api/v1/figmaimports/createupload";
      var http = new XMLHttpRequest();
      var formData = new FormData();
      formData.append("website_id", "8afea140-a87b-461f-9dd7-7469034f91cb");
      formData.append("image", image, "figma-image-5.png");

      // formData.append("image", image);
    
      http.open("POST", urlString, true);
      http.onreadystatechange = function () {
    
        if (http.readyState == XMLHttpRequest.DONE && http.status == 200) {
    
          console.log(http.response);
    
        }
    
      };
    
      http.send(formData);
    // }

    // if (file) {
    //   reader.readAsDataURL(file);
    // }
    }
  };

  xhr.send(null);

};


var figmaImportPostReq = function () {

  var url = getFigmaImportUrlObject();

  var urlString = "/" + url.xfigmatoken + "/" + url.fileid + "/" + url.nodeid;
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

  if (resp.result.html) {

    figmaImportContent.innerHTML = resp.result.html;

  }

  // if (resp.result.type == "html") {

  //   figmaImportContent.innerHTML = resp.result.content;

  // } else {

  //   figmaImportContent.innerHTML = JSON.stringify(resp.result.content);

  // }

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

  var url = {
    fileid: fileId,
    nodeid: nodeId,
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