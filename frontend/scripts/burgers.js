
function checkIfRatingExists() {
    req = new XMLHttpRequest();
    var ip = location.host;
    var burgerID = getUrlVars().Bid;
    var url = "http://" + ip + "/ratings/" + burgerID + "/" + globalID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            console.log(globalID)
            if (json.length > 0) {
                disableRate();
            }else{
                enableRate();
            }
        }
    }
}

function disableRate() {
    var rateButton = $(".rate");
    rateButton.find("h1").text("Jump to my rating");
    rateButton.attr("onclick", "jumptoMyRate()");
}
function enableRate() {
    var rateButton = $(".rate");
    rateButton.find("h1").text("Rate");
    rateButton.attr("onclick", "showRateField()");
}

function jumptoMyRate() {
    $('html, body').animate({
        scrollTop: $("table[user='" + globalID + "']").offset().top
    }, 2000);
}

function listBurgers() {
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://" + ip + "/burgers";
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            json.forEach(function (element) {
                if (element.visible != 0) {
                    var data = "";
                    data +=
                        "<table class='table table-striped' cellpadding='30'>" +
                        "<tbody>" +
                        "<tr'>" +
                        "<td style='vertical-align:middle; width:40%; '>" +
                        "<a href='burgerpage.html?Bid=" + element.burgerID + "'>" +
                        "<h1>" +
                        element.burgerName +
                        "</h1>" +
                        "</a>" +
                        "</td>" +
                        "<td style='vertical-align:bottom !important;' align='right'>" +
                        "<i>by <a href='placepage.html?Pid=" + element.placeID + "'>" +
                        element.placeName +
                        "</i>" +
                        "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td colspan='2'>" +
                        element.description +
                        "</td>" +
                        "</tr>" +
                        "</tbody>"
                    "</table><br>";

                    $("div[name='datas']").append(data);
                    // console.log(data) 
                }
            }, this);


        }
    }
}



function getBurgerDatas() {
    req = new XMLHttpRequest();
    var ip = location.host;
    var burgerID = getUrlVars().Bid;
    var url = "http://" + ip + "/burgers/" + burgerID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            console.log(json)
            json.forEach(function (element) {
                $(".burgerName").text(element.burgerName);
                $(".burgerName").attr("id", element.burgerID);
                $(".placeName").text(element.placeName);
                $(".placeName").attr("value", element.placeID);
                $(".placeName").parent().attr("href", "placepage.html?Pid=" + element.placeID);

                var pTaste = element.pTaste ? (element.pTaste).toString().substring(0, 4) : 0;
                var pPrepareTime = element.pPrepareTime ? (element.pPrepareTime).toString().substring(0, 4) : 0;
                var pApperance = element.pApperance ? (element.pApperance).toString().substring(0, 4) : 0;
                var pTotal = element.pTotal ? (element.pTotal).toString().substring(0, 4) : 0;
                $(".pTaste").text(pTaste);
                $(".pPrepareTime").text(pPrepareTime);
                $(".pApperance").text(pApperance);
                $(".pTotal").text(pTotal);
                if(element.image == null){
                    element.image = "sample-blue.png";
                }
                $(".burgerImg").attr("src", element.image);
                $(".numberOfRatings").text(element.count);
                $(".description").text(element.description);
            }, this);
            getRatings();

        }
    }
}

function getRatings() {
    req = new XMLHttpRequest();
    var ip = location.host;
    var burgerID = getUrlVars().Bid;
    var url = "http://" + ip + "/ratings/" + burgerID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            var data = "<br><br>";

            json.forEach(function (element) {
                var deleteRating = "";
                if (element.userID == globalID || globalPerm > 1){
                    deleteRating = "<td style='text-align:right;'><button style='cursor:pointer;' onclick=\"popupShowHide('block',"+element.ratingID+");\" class='btn btn-danger btn-lg'>"+
                    "<span class='glyphicon glyphicon-trash'></span>"+ 
                  "</button></td>";
                }
                
                data += "<table id='" + element.ratingID + "' user='" + element.userID + "' width='100%'><tr><td style='width:300px'><div style='padding: 0px 0px 0px 0px;'>" +
                    "<div style='width: 70px; float: left; padding-right: 10px;'><img style='max-width: 60px; max-height: 60px; height: auto; width: auto; border-radius: 50%;' width='60';' " +
                    "src='/avatars/"+element.image+".png'>" +
                    "</div>" +
                    "<div style='display:inline; padding: 0px 0px; font-size: 24px; font-weight: bold; color: #036;'>" + element.pTotal.toString().substring(0, 4) + "</div>" +
                    "</div><small style='color: #666666; font-size: 12px; font-weight: bold;'><a id='count' class='userName' href='/myhistory.html?user="+element.userID+"'>" + element.userName + "</a></small></td>" +
                    "<td width='60%' valign='bottom' align='right'><small style='color:grey'>" +
                    element.date.split(".")[0].replace("T", "  :  ") +
                    "</small></td>" +
                    "<td style='float:right;'>" +
                    "<b class='likes'>" + element.likes + "</b><h1><i href='#' onclick='sendLike(this," + element.ratingID + ")' value='off' class='fa fa-thumbs-o-up'style='cursor: pointer;' ></i></h1></td>"+
                    deleteRating +"</tr></table>" +
                    "<br>" +
                    "<small>TASTE: <b>" + element.pTaste + "&emsp;</b>PREPARE TIME: <b>" + element.pPrepareTime + "&emsp;</b> APPEARANCE: <b>" + element.pApperance + "</b></small>" +
                    "<div style='padding: 20px 10px 20px 0px; border-bottom: 1px solid #e0e0e0; line-height: 1.5;'>" + element.comment + "</div>" +
                    "<br>";
            }, this);

            getLikes();
            $(".reviews-container").html("");
            $(".reviews-container").append(data);
        }
    }
}
function getLikes() {
    req = new XMLHttpRequest();
    var ip = location.host;
    var burgerID = getUrlVars().Bid;
    var userID = globalID;
    var url = "http://" + ip + "/likes/" + burgerID + "/" + userID;
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var json = JSON.parse(req.responseText);
            json.forEach(function (element) {
                $("table[id=" + element.ratingID + "]").find("i").attr("value", "on")
                $("table[id=" + element.ratingID + "]").find("i").attr("class", "fa fa-thumbs-o-up fa-thumbs-up");
            }, this);
            checkIfRatingExists();
        }
    }
}
function deleteRating(ratingID){
    $(function() {
        $('.confirm').click(function(e) {
            e.preventDefault();
            if (window.confirm("Are you sure?")) {
                location.href = this.href;
            }
        });
    });
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/ratings/"+ratingID;
    req.open("DELETE", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            if(req.responseText=="OK"){
                getBurgerDatas();
            }
        }
    }

}
$(window).click(function(event) {
    console.log(event.target.nodeName);
    if (event.target.nodeName == "DIV" || event.target.nodeName == "A") {
        popupShowHide("none");
    }
});

function popupShowHide(action,ratingID){
    $("div[id='confirm']").css("display",action);
    $("a[id='yes']").attr("onclick","deleteRating("+ratingID+")");
}/*
function modal(){
    var modal = $("div[id='confirm']");
    var btn = $("button[class='sun']");
    var span = $("span[class='close']");
    btn.attr("onclick","popupShowHide('block')");       
    span.attr("onclick","popupShowHide('none')");
    $(window).click(function(event) {
        console.log(event.target.nodeName);
        if (event.target.nodeName == "DIV") {
            popupShowHide("none");
        }
    });
}
*/
function sendRating() {
    var burgerID = $(".burgerName").attr("id");
    var taste = $("#taste").find(":checked").val();
    var prepare = $("#prepare").find(":checked").val()
    var appear = $("#appear").find(":checked").val();
    var total = (parseInt(taste) + parseInt(prepare) + parseInt(appear)) / 3;
    var comment = $(".comment").val();
    var userID = globalID;
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://" + ip + "/rate";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText)

            if (req.responseText == "OK") {
                hideRateField();
                $(".response-success").show();
                getBurgerDatas();
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


function sendLike(x, id) {
    var isLike = true;
    if (($("table[id=" + id + "]")).find("i").attr("value") == "on") {
        isLike = false;
    }
    var burgerID = getUrlVars().Bid.replace("#", "");
    var userID = globalID;
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://" + ip + "/like";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText)
            if (req.responseText == "OK") {
                var val = parseInt($("table[id=" + id + "]").find(".likes").text());
                if (!isLike) {
                    val = val - 1;
                    $("table[id=" + id + "]").find("i").attr("value", "off")
                } else {
                    val = val + 1;
                    $("table[id=" + id + "]").find("i").attr("value", "on")
                }
                $("table[id=" + id + "]").find(".likes").text(val)

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





function hideResponse() {
    $(".response-success").hide();
}


function showRateField() {
    $(".sendComment").show();
    $("#taste").find("*[value=1]").click();
    $("#prepare").find("*[value=1]").click();
    $("#appear").find("*[value=1]").click();
    $(".comment").val("");
}
function hideRateField() {
    $(".sendComment").hide();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
