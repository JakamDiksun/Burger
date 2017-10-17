
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getResponseHeader("user").toLowerCase();
var globalID = headers.split("|")[0];
var globalPerm =headers.split("|")[1];
console.log("id:"+globalID+"globalPerm:"+globalPerm);

function getTopList(type){
    req = new XMLHttpRequest();
    var ip = location.host;
    var placeID = getUrlVars().Pid;
    var url = "http://"+ip+"/toplist/burgers/"+type;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText)
            var json = JSON.parse(req.responseText);
            var count = 1;
            var viewPoint ="";  
            json.forEach(function (element) {
                switch (type) {
                    case 1:
                        viewPoint = element.pTaste.toString()
                        break;
                    case 2:
                        viewPoint = element.pPrepareTime.toString()
                        break;
                    case 3:
                        viewPoint = element.pApperance.toString()
                        break;
                    case 4:
                        viewPoint = element.pTotal.toString()
                        break;
                }
                $("mark[id='"+count+"']").text(element.burgerName);
                $("small[id='"+count+"']").text(viewPoint.substring(0,4));
                $("mark[id='"+count+"']").parent().attr("onclick", "location.href='burgerpage.html?Bid="+element.burgerID+"'");
                count++;
            }, this);   
            
        }
    }
}  


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}
