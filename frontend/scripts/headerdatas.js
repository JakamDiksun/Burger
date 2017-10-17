
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("user").toLowerCase();
var globalID = headers.split("|")[0];
var globalPerm =headers.split("|")[1];
console.log("kam:"+globalID);