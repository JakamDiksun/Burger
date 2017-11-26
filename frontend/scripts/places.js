function getPlaceDatas(){
    req = new XMLHttpRequest();
    var ip = location.host;
    var placeID = getUrlVars().Pid;
    var url = "http://"+ip+"/places/"+placeID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            json.forEach(function (element) {
                console.log(element.placeName)
                $(".placeName").html(element.placeName)
                $(".placeDescription").html(element.description)
                if(element.image == null){
                    element.image = "sample-blue.png";
                }
                $(".placeNumber").html("PHONE NUMBER: "+element.phoneNumber);
                $(".placeImage").attr("src",element.image)
                $(".mapLink").attr("href","map.html?Pid="+element.placeID);
            }, this);   
            getBurgers();    
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


/// Lekerdezest irni ami visszaadja a placehez tartozo burgereket
function getBurgers(){
    req = new XMLHttpRequest();
    var ip = location.host;
    var placeID = getUrlVars().Pid;
    var url = "http://"+ip+"/place/datas/"+placeID;
    req.open("GET", url, true);
    req.send();
    console.log("sun")
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);

            console.log(json)
            var data = "";
            json.forEach(function (element) {
                if(element.image == null){
                    element.image = "sample-blue.png";
                }
                data += "<tr>"+
                    "<td class='hidden-sm hidden-xs' style='text-align:right; vertical-align: middle;width: 140px;'>"+
                        "<img src='"+element.image+"'>"+
                    "</td>"+
                    "<td style='padding-bottom:30px;'>"+
                        "<div style='float:right;text-align:right;width:80px;text-align:center;'>"+
                            "<br>"+
                            "<div style='padding: .9em .5em .5em .5em;' class='label label-danger' name='totalPoints' id="+element.burgerID+"><b style='font-size:16px;'>N/A</b> </div>"+
                            "<br>"+
                            "<div style='font-size:11px;padding-top:5px;'><span class='hidden-md hidden-lg hidden-xl' style='font-size:24px;padding-top:0px;'></span>"+
                            "</div>"+
                        "</div><span style='padding-bottom:20px;'><h3><a href='burgerpage.html?Bid="+element.burgerID+"'>"+element.burgerName+"</a></h3> </span>"+
                        
                        "<div>"+
                            "<div></div><span style='font-size:12px'><span class='glyphicon glyphicon-star' style='color:#336699;' aria-hidden='true'></span>"+
                            " <span style='color:#777;' name='totalRatings' id='"+element.burgerID+"' href=#>TOTAL RATINGS: <b style='font-size:16px;'>0</b></span>"+
                            "</span>"+
                        "</div>"+
                       // "<div style='font-size:13px;padding-bottom:10px;'><a href='tel:5183548270'><span class='glyphicon glyphicon-phone' aria-hidden='true'></span>  518-354-8270</a>"+
                       // "</div>"+
                        
                      //  "<div style='font-size:12px;color:#777;'><span class='glyphicon glyphicon-time' aria-hidden='true'></span> Mon-Thu: 12:00 pm - 12:00 am Fri-Sat: 12:00 pm - 2:00 am Sun: 12:00 pm - 12:00 am</div>"+

                    "</td>"+
                "</tr>";
            }, this);  
            $(".burgerList").html("");
            $(".burgerList").append(data); 
            getBurgerRatings()        
        }
    }
} 


function getBurgerRatings(){
    req = new XMLHttpRequest();
    var ip = location.host;
    var placeID = getUrlVars().Pid;
    var url = "http://"+ip+"/place/ratings/"+placeID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            json.forEach(function (element) {
                $("span[name='totalRatings'][id='"+element.burgerID+"']").html("TOTAL RATINGS: <b style='font-size:16px;'>"+element.count+"</b>");
                $("div[name='totalPoints'][id='"+element.burgerID+"']").html("<b style='font-size:16px;'>"+element.pTotal.toString().substring(0,4)+"</b>");
                if (parseFloat(element.pTotal.toString().substring(0,4)) < 2.33){
                    $("div[name='totalPoints'][id='"+element.burgerID+"']").attr("class","label label-warning")
                }else if (parseFloat(element.pTotal.toString().substring(0,4)) > 3.66){
                    $("div[name='totalPoints'][id='"+element.burgerID+"']").attr("class","label label-success")
                }else{
                    $("div[name='totalPoints'][id='"+element.burgerID+"']").attr("class","label label-info")
                }
            }, this);          
        }
    }
} 