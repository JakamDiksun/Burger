
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("user").toLowerCase();
var globalID = headers.split("|")[0];
var globalPerm =headers.split("|")[1];
console.log("Permission :"+globalPerm);
console.log("UserID :"+globalID);
var sideMenu = $("ul[class='nav navbar-nav side-nav']");

$(document).ready(function () {
    checkPermissions();
});


function checkPermissions(){
    if (globalPerm > 1){
        console.log("admin is logged in")
        $("ul[class='nav navbar-nav side-nav']").append("<li><a href='manage.html'><i class='fa fa-fw fa-file'></i> Manage datas</a></li>");
    }
};
