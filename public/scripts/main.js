var figmaImportButton = document.getElementById("figma-import-button");


figmaImportButton.addEventListener("click", function (event) {
 
  var url = "/sitecontent";
  var params = "";
  // var params = "somevariable=somevalue&anothervariable=anothervalue";
  var http = new XMLHttpRequest();

  http.open("POST", url + "?" + params, true);
  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      alert(http.responseText);
    }
  }
  http.send(null);
  

});