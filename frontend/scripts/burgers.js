

function listBurgers(){
        req = new XMLHttpRequest();
        var ip = location.host;
        var url = "http://"+ip+"/burgers";
        req.open("GET", url, true);
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var json = JSON.parse(req.responseText);
                json.forEach(function (element) {
                    var data = "";
                      data +=                       
                       "<table class='table table-striped' cellpadding='30'>"+
                       "<tbody>"+
                            "<tr'>"+
                                "<td style='vertical-align:middle; width:10%; '>"+
                                    "<a href='burgerpage.html?Bid="+element.burgerID+"'>"+
                                    "<h1>"+
                                    element.burgerName+
                                    "</h1>"+
                                    "</a>"+
                                "</td>"+
                                "<td style='vertical-align:bottom !important;' align='right'>"+
                                "<i>by <a href='placepage.html?Pid="+element.placeID+"'>"+
                                element.placeName+
                                "</i>"+
                                "</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td colspan='2'>"+
                                element.description+
                                "</td>"+
                            "</tr>"+
                            "</tbody>"
                        "</table><br>";
                        
                    $("div[name='datas']").append(data);
                    console.log(data) 
                }, this);  
                
                    
            }
        }
}  



function getBurgerDatas(){
    req = new XMLHttpRequest();
    var ip = location.host;
    var burgerID = getUrlVars().Bid;
    var url = "http://"+ip+"/burgers/"+burgerID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            json.forEach(function (element) {
                $(".burgerName").text(element.burgerName);
                $(".burgerName").attr("id",element.burgerID);
                $(".placeName").text(element.placeName);
                $(".placeName").attr("value",element.placeID);
                $(".placeName").parent().attr("href","placepage.html?Pid="+element.placeID);

                var pTaste = element.pTaste? (element.pTaste).toString().substring(0,4) : 0;
                var pPrepareTime = element.pPrepareTime? (element.pPrepareTime).toString().substring(0,4) : 0;
                var pApperance = element.pApperance? (element.pApperance).toString().substring(0,4) : 0;
                var pTotal = element.pTotal? (element.pTotal).toString().substring(0,4) : 0;
                $(".pTaste").text(pTaste);
                $(".pPrepareTime").text(pPrepareTime);
                $(".pApperance").text(pApperance);
                $(".pTotal").text(pTotal);

                $(".numberOfRatings").text(element.count);
                $(".description").text(element.description);
            }, this);   
            getRatings();        
        }
    }
}  

function getRatings(){
    req = new XMLHttpRequest();
    var ip = location.host;
    var burgerID = getUrlVars().Bid;
    var url = "http://"+ip+"/ratings/"+burgerID;
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
                        "<td width='60%' valign='bottom' align='right'><small style='color:grey'>"+
                        element.date.split(".")[0].replace("T","  :  ")+
                        "</small></td>"+
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
function getLikes(){
    req = new XMLHttpRequest();
    var ip = location.host;
    var burgerID = getUrlVars().Bid;
    var userID = 2;
    var url = "http://"+ip+"/likes/"+burgerID+"/"+userID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            json.forEach(function (element) {
               $("table[id="+element.ratingID+"]").find("i").attr("value","on")
               $("table[id="+element.ratingID+"]").find("i").attr("class","fa fa-thumbs-o-up fa-thumbs-up");
            }, this);        
        }
    }
} 

function sendRating(){
    var burgerID = $(".burgerName").attr("id");
    var taste = $("#taste").find(":checked").val();
    var prepare = $("#prepare").find(":checked").val()
    var appear = $("#appear").find(":checked").val();
    var total = (parseInt(taste)+parseInt(prepare)+parseInt(appear))/3;
    var comment = $(".comment").val();
    var userID = 2;
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/rate";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                console.log(req.responseText)
            
                    if(req.responseText=="OK"){
                        hideRateField();
                        $(".response-success").show();
                        getBurgerDatas();
                    }else if(req.responseText=="Empty"){
                    var messageNode = "<h5 class='err'><font color='red'>Please fill all the fields!</font></h5>";
                    console.log(messageNode);
                    document.querySelector("div[name='err_userName']").innerHTML = messageNode;
                    }else{
                        console.log(req.responseText);
                    var errArray = req.responseText.split("'");
                    var duplField = errArray[errArray.length-2];
                    console.log(errArray);
                    var messageNode = "<h5 class='err'><font color='red'>The "+duplField.toLowerCase()+" is already taken!</font></h5>";
                    console.log(messageNode);
                    document.querySelector("div[name='err_"+duplField+"']").innerHTML = messageNode;
                }
        }
    }
    var data = JSON.stringify(
        {
            "userID": userID,
            "burgerID": burgerID,
            "taste": taste,
            "prepare": prepare,
            "appear": appear,
            "total": total,
            "comment": comment
            
        }
    );
    req.send(data);  
}


function sendLike(x,id){
    var isLike = true;
    if (($("table[id="+id+"]")).find("i").attr("value") == "on"){
            isLike = false;
    }
    var burgerID = getUrlVars().Bid.replace("#","");
    var userID = 2;
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/like";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                console.log(req.responseText)
                if (req.responseText == "OK"){
                    var val = parseInt($("table[id="+id+"]").find(".likes").text());
                    if (!isLike){
                        val = val - 1;
                        $("table[id="+id+"]").find("i").attr("value","off")
                    }else{
                        val = val + 1;
                        $("table[id="+id+"]").find("i").attr("value","on")
                    }
                    $("table[id="+id+"]").find(".likes").text(val)
                    
                    x.classList.toggle("fa-thumbs-up");
                }
        }
    }
    var data = JSON.stringify(
        {
            "userID": userID,
            "ratingID": id, 
            "burgerID": burgerID,
            "isLike": isLike       
        }
    );
    req.send(data);  
}





function hideResponse(){
    $(".response-success").hide();
}
 

function showRateField(){
    $(".sendComment").show();
    $("#taste").find("*[value=1]").click();
    $("#prepare").find("*[value=1]").click();
    $("#appear").find("*[value=1]").click();
    $(".comment").val("");
}
function hideRateField(){
    $(".sendComment").hide();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}
