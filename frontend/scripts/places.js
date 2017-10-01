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
    var burgerID = getUrlVars().Bid;
    var url = "http://"+ip+"/places/";
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            var data = "<br><br>";
            json.forEach(function (element) {
                data += "<table id='"+element.ratingID+"' width='100%'><tr><td style='width:300px'><div style='padding: 0px 0px 0px 0px;'>"+
                            "<div style='width: 70px; float: left; padding-right: 10px;'><img style='max-width: 60px; max-height: 60px; height: auto; width: auto; border-radius: 50%;' width='60';' "+
                            "src='https://www.jcdanczak.com/images/samples.png'>"+
                            "</div>"+
                            "<div style='display:inline; padding: 0px 0px; font-size: 24px; font-weight: bold; color: #036;'>"+element.pTotal.toString().substring(0,4)+"</div>"+
                        "</div><small style='color: #666666; font-size: 12px; font-weight: bold;'><a id='count' class='userName' href='#'>"+element.userName+"</a></small></td>"+
                        "<td style='float:right;'>"+
                            "<b class='likes'>"+element.likes+"</b><h1><i href='#' onclick='sendLike(this,"+element.ratingID+")' value='off' class='fa fa-thumbs-o-up'style='cursor: pointer;' ></i></h1></td></tr></table>"+
                        "<br>"+
                        "<small>TASTE: <b>"+element.pTaste+"&emsp;</b>PREPARE TIME: <b>"+element.pPrepareTime+"&emsp;</b> APPEARANCE: <b>"+element.pApperance+"</b></small>"+
                        "<div style='padding: 20px 10px 20px 0px; border-bottom: 1px solid #e0e0e0; line-height: 1.5;'>"+element.comment+"</div>"+
                        "<br>";
            }, this);  
            
            getLikes();
            $(".reviews-container").html("");
            $(".reviews-container").append(data);         
        }
    }
} 