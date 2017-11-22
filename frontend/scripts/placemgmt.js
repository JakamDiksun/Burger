var placeIDList = [];

function stopEditAllPlaces(){
    placeIDList.forEach(function(element) {
        if($("button[type='edit'][id='"+element+"']").attr("name") == "edit")
        stopEditPlace(element);
    });
}


function readFileNewP() {
    
    if (this.files && this.files[0]) {
      var FR= new FileReader();
      FR.addEventListener("load", function(e) {
        document.getElementById("inpNewP").src = e.target.result;
    });   
    FR.readAsDataURL( this.files[0] );
    }
    
  }
function popupShowHidePlace(action){
    readFileNewP();
    document.getElementById("inpNewP").addEventListener("change", readFileNewP);
    //getPlaceNamesNewBurger();
    $("div[id='myModalPlace']").css("display",action);
    $("input[type='placeName']").val("");
    $("input[type='phoneNumber']").val("");
    $("input[name='GPS-X']").val("");
    $("input[name='GPS-Y']").val("");
    $("textarea[type='description']").val("");
    $("input[type='file']").eq(1).attr("src","");
}
function modalPlace(){
    var modal = $("div[id='myModalPlace']");
    var btn = $("button[id='myBtnPlc']");
    var span = $("span[class='close'][id='burger']");
    btn.attr("onclick","popupShowHidePlace('block')");       
    span.attr("onclick","popupShowHidePlace('none')");
    $(window).click(function(event) {
        console.log(event.target.nodeName);
        if (event.target.nodeName == "DIV") {
            popupShowHidePlace("none");
        }
    });
}

function listPlaces(){
    
    $("div[name='user']").hide();
    $("div[name='place']").show();
    $("div[name='burger']").hide();
    reqUser = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places";
    reqUser.open("GET", url, true);
    reqUser.setRequestHeader("Content-Type", window.location.pathname)
    reqUser.send();
    reqUser.onreadystatechange = function () {
        if (reqUser.readyState == 4 && reqUser.status == 200) {
            var json = JSON.parse(reqUser.responseText);
            var datas = "";
            var count = 0;
            json.forEach(function (element) {
                placeIDList[count] = element.placeID;
                count++;
                var bgcolor ="";
                var deletePlaceButton = "delete";
                var deletePlaceIcon ="trash";
                if (element.visible == 0){
                    bgcolor = "#ffd3d3";
                    deletePlaceButton = "reset"; 
                    deletePlaceIcon = "refresh";
                }
                datas += "<tr "+bgcolor+" class='tbl-plc' id="+element.placeID+" bgcolor='"+bgcolor+"'><td width='5%'>" + element.placeID +
                            "</td><td width='15%' value='"+element.placeName+"'>" + element.placeName +
                            "</td><td width='15%' value='"+element.phoneNumber+"'>" + element.phoneNumber +
                            "</td><td width='50%' value='desc'><textarea class='form-control' rows='5' readonly>" + element.description + "</textarea>" +
                            "</td><td width='20%' value='img'><img src='" + element.image + "'></td>"+
                            "</td><td width='15%' value='"+element.gpsX+"'>" + element.gpsX +
                            "</td><td width='15%' value='"+element.gpsY+"'>" + element.gpsY +
                            "<td width='10%' style='text-align:left' id="+element.placeID+" name='modify' >"+
                                "<button type='edit' class='btn btn-warning' name='read' id = '" + element.placeID + "' onclick='editPlace(" + element.placeID + ")'>"+
                                    "<span color='white' class='glyphicon glyphicon-edit' aria-hidden='true'></span>"+
                                "</button> "+
                                "<button type='update' class='btn btn-success' name='update' style='display:none;' id = '" + element.placeID + "' onclick ='updatePlace(" + element.placeID + ")'>"+
                                    "<span class='glyphicon glyphicon-upload' aria-hidden='true'></span>"+
                                "</button> "+
                                "<button type='delete' class='btn btn-danger' name='delete' style='display:none;' id = '" + element.placeID + "' onclick='"+deletePlaceButton+"Place(" + element.placeID + ")'>"+
                                    "<span class='glyphicon glyphicon-"+deletePlaceIcon+"' aria-hidden='true'></span>"+
                                "</button>"+
                            "</td>"+
                            // "<td id="+element.userID+" name='update' style='display:none;'><button id = '" + element.userID + "' onclick ='update(" + element.userID + ")'>Update</button></td>"+
                            // "<td id="+element.userID+" name='delete' style='display:none;'><button id = '" + element.userID + "' onclick ='deleteUser(" + element.userID + ")'>Delete</button></td>"+
                            "<td id="+element.placeID+" name='response' style='display:none;'></td></tr>";
            }, this);
            document.querySelector('.jsonPlace').innerHTML = datas;
        }
    }
}



function editPlace(placeID){
    stopEditAllPlaces();
    var rowTds = $("tr[class='tbl-plc'][id='"+placeID+"']").find("td");
    //getPlaceNames(placeID);
    $("button[type='edit'][id="+placeID+"]").attr("onclick", "stopEditPlace("+placeID+")");
    $("button[type='edit'][id="+placeID+"]").attr("name", "edit");
    $("button[type='update'][id="+placeID+"]").show();
    $("button[type='delete'][id="+placeID+"]").show();
    $("button[type='edit'][id="+placeID+"]").attr("class","btn btn-info");
    var placeName = rowTds.eq(1).text();
    var phoneNumber = rowTds.eq(2).text();
    var description = rowTds.eq(3).text();
    var image = rowTds.eq(4).find("img").attr("src");
    var gpsX = rowTds.eq(5).text();
    var gpsY = rowTds.eq(6).text();
    rowTds.eq(1).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='placeName' raw='"+placeName+"' value='"+placeName+"'>");
    rowTds.eq(2).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='phoneNumber' raw='"+phoneNumber+"' value='"+phoneNumber+"'>");
    rowTds.eq(3).find("textarea").removeAttr("readonly")
    rowTds.eq(3).find("textarea").attr("raw",description);
    rowTds.eq(4).html("<input class='form-control' id='inp' type='file' raw='"+image+"' src='"+image+"'><br>");
    rowTds.eq(5).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='gpsX' raw='"+gpsX+"' value='"+gpsX+"'>");
    rowTds.eq(6).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='gpsY' raw='"+gpsY+"' value='"+gpsY+"'>");
    
    readFile();
    document.getElementById("inp").addEventListener("change", readFile);

    $("td[name='update'][id="+placeID+"]").show()
    $("td[name='delete'][id="+placeID+"]").show()
}
function stopEditPlace(placeID){
    $("button[type='edit'][id="+placeID+"]").attr("onclick", "editPlace("+placeID+")");
    $("button[type='edit'][id="+placeID+"]").attr("name", "read");
    $("button[type='update'][id="+placeID+"]").hide();
    $("button[type='delete'][id="+placeID+"]").hide();
    $("button[type='edit'][id="+placeID+"]").attr("class","btn btn-warning");
        var rowTds = $("tr[class='tbl-plc'][id='"+placeID+"']").find("td");
        var placeName = rowTds.eq(1).find("input").attr("raw");
        var phoneNumber = rowTds.eq(2).find("input").attr("raw");
        var description = rowTds.eq(3).find("textarea").html();
        var image = rowTds.eq(4).find("input").attr("raw");
        var gpsX = rowTds.eq(5).find("input").attr("raw");
        var gpsY = rowTds.eq(6).find("input").attr("raw");
        rowTds.eq(1).html(placeName);
        rowTds.eq(2).html(phoneNumber);
        rowTds.eq(3).find("textarea").val(rowTds.eq(3).find("textarea").attr("raw"))
        rowTds.eq(3).find("textarea").attr("readonly","readonly");
        rowTds.eq(4).html("<img src='" + image + "'>");
        rowTds.eq(5).html(gpsX);
        rowTds.eq(6).html(gpsY);
    $("td[name='update'][id="+placeID+"]").hide()
    $("td[name='delete'][id="+placeID+"]").hide()
    $("td[name='response'][id="+placeID+"]").hide()
    //$("th:contains('Modify')").hide();
    //$("th:contains('Delete')").hide();
}

function updatePlace(placeID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places/update";
    req.open("PUT", url, true);
    req.setRequestHeader("Content-type", "application/json");
    var placeName = $("tr[id="+placeID+"][class='tbl-plc']").find("td").eq(1).find("input").val()
    var phoneNumber = $("tr[id="+placeID+"][class='tbl-plc']").find("td").eq(2).find("input").val()
    var description = $("tr[id="+placeID+"][class='tbl-plc']").find("td").eq(3).find("textarea").val();
    var image = $("tr[id="+placeID+"][class='tbl-plc']").find("td").eq(4).find("input").attr("src");
    var gpsX = $("tr[id="+placeID+"][class='tbl-plc']").find("td").eq(5).find("input").val()
    var gpsY = $("tr[id="+placeID+"][class='tbl-plc']").find("td").eq(6).find("input").val()
    placeName = placeName == "" ? null: placeName;
    phoneNumber = phoneNumber == "" ? "-": phoneNumber;
    description = description == "" ? null: description;
    gpsX = gpsX == "" ? null: gpsX;
    gpsY = gpsY == "" ? null: gpsY;
    
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                console.log(req.responseText)
                    if(req.responseText=="OK"){
                        updateViewPlace(placeID);
                        $("tr[class='tbl-plc'][id="+placeID+"]").attr("bgcolor","#f7fff4")
                    }else if(req.responseText=="Empty"){
                        var messageNode = "<h5 style='width: 200px;' class='err'><font color='red'>Please fill all the fields!</font></h5>";
                        console.log(messageNode);
                        alert("Please fill all the fields!");
                    }else{
                        var errArray = req.responseText.split("'");
                        var duplField = errArray[errArray.length-2];
                        alert("The "+duplField.toLowerCase()+" is already taken!");
                }
        }
    }
    var data = JSON.stringify(
        {
            "placeID": placeID,
            "placeName": placeName,
            "phoneNumber": phoneNumber,
            "description": description,
            "image": image,
            "gpsX" : gpsX,
            "gpsY": gpsY
        }
    );
    req.send(data);
}


function addPlace(){
    document.querySelector("div[name='err_placeName']").innerHTML = "";
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places/post";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    var placeName = $("input[type='placeName']").val();
    var phoneNumber = $("input[type='phoneNumber']").val();
    var description = $("textarea[type='description']").eq(1).val();
    var image = $("input[type='file']").eq(1).attr("src");
    var gpsX = $("input[name='GPS-X']").val(); 
    var gpsY = $("input[name='GPS-Y']").val(); 
    placeName = placeName == "" ? null: placeName;
    phoneNumber = phoneNumber == "" ? null: phoneNumber;
    description = description == "" ? null: description;
    image = image == "" ? null: image;
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                document.querySelector("div[name='err_userName']").innerHTML = "";
                document.querySelector("div[name='err_email']").innerHTML = "";
                    if(req.responseText=="OK"){
                        $("input[type='placeName']").val("");
                        $("span[ng-show='myForm.email.$error.email']").text("")
                        popupShowHidePlace("none");
                        alert("Place added to the database!");
                        listPlaces();
                    }else if(req.responseText=="Duplicate"){
                        var errArray = req.responseText.split("'");
                        var duplField = errArray[errArray.length-2];
                        var messageNode = "<h5 class='err'><font color='red'>The "+duplField.toLowerCase()+" is already taken!</font></h5>";
                        console.log(messageNode);
                        document.querySelector("div[name='err_placeName']").innerHTML = messageNode;
                    }else if(req.responseText=="Empty"){
                        var messageNode = "<h5 class='err'><font color='red'>Please fill all the fields!</font></h5>";
                        console.log(messageNode);
                        document.querySelector("div[name='err_placeName']").innerHTML = messageNode;
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
            "placeName": placeName,
            "phoneNumber": phoneNumber,
            "description": description,
            "image": image,
            "gpsX" : gpsX,
            "gpsY" : gpsY
        }
    );
    req.send(data);
}

function updateViewPlace(placeID){
    $("button[type='edit'][id="+placeID+"]").attr("onclick", "editPlace("+placeID+")");
    $("button[type='edit'][id="+placeID+"]").attr("name", "read");
    $("button[type='update'][id="+placeID+"]").hide();
    $("button[type='delete'][id="+placeID+"]").hide();
    $("button[type='edit'][id="+placeID+"]").attr("class","btn btn-warning");
        var rowTds = $("tr[class='tbl-plc'][id='"+placeID+"']").find("td");
        var placeName = rowTds.eq(1).find("input").val();
        var phoneNumber = rowTds.eq(2).find("input").val();
        var description = rowTds.eq(3).find("textarea").val();
        var image = rowTds.eq(4).find("input").attr("src");
        var gpsX = rowTds.eq(5).find("input").val();
        var gpsY = rowTds.eq(6).find("input").val();
        rowTds.eq(1).html(placeName);
        rowTds.eq(2).html(phoneNumber);
        rowTds.eq(3).find("textarea").attr("readonly","readonly");
        rowTds.eq(4).html("<img src='" + image + "'>");
        rowTds.eq(5).html(gpsX);
        rowTds.eq(6).html(gpsY);

    $("td[name='update'][id="+placeID+"]").hide()
    $("td[name='delete'][id="+placeID+"]").hide()
    $("td[name='response'][id="+placeID+"]").hide()
}

function deletePlace(placeID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places/"+placeID;
    req.open("DELETE", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            if(req.responseText=="OK"){
                console.log("SUCCESS");
                stopEditPlace(placeID);
                $("tr[class='tbl-plc'][id="+placeID+"]").attr("bgcolor","#ffd3d3")
            }else if(req.responseText=="Error"){
                console.log("Hiba");
                makePlaceInvisible(placeID);
                $("tr[class='tbl-plc'][id="+placeID+"]").attr("bgcolor","#ffd3d3")
                
            }
        }
    }
}

function makePlaceInvisible(placeID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places/invisible";
    req.open("PUT", url, true);
    req.setRequestHeader("Content-type", "application/json");    
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText)
            stopEditPlace(placeID);
            $("button[name='delete'][id="+placeID+"]").attr("onclick","resetPlace("+placeID+")")
            $("button[name='delete'][id="+placeID+"]").find("span").attr("class","glyphicon glyphicon-refresh")
        }
    }
    var data = JSON.stringify(
        {
            "placeID": placeID
        }
    );
    req.send(data);
}


function resetPlace(placeID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places/visible";
    req.open("PUT", url, true);
    req.setRequestHeader("Content-type", "application/json");    
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText)
            stopEditPlace(placeID);
            $("tr[class='tbl-plc'][id="+placeID+"]").attr("bgcolor","")
            $("button[name='delete'][id="+placeID+"]").attr("onclick","deletePlace("+placeID+")")
            $("button[name='delete'][id="+placeID+"]").find("span").attr("class","glyphicon glyphicon-trash")
            
        }
    }
    var data = JSON.stringify(
        {
            "placeID": placeID
        }
    );
    req.send(data);
}
