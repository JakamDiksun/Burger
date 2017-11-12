var burgerIDList = [];

function stopEditAllBurgers(){
    console.log(burgerIDList)
    burgerIDList.forEach(function(element) {
        if($("button[type='edit'][id='"+element+"']").attr("name") == "edit")
        stopEditBurger(element);
    });
}

function popupShowHideBurger(action){
    readFileNew();
    document.getElementById("inpNew").addEventListener("change", readFileNew);
    getPlaceNamesNewBurger();
    $("div[id='myModalBurger']").css("display",action);
    $("input[type='burgerName']").val("");
    $("textarea[type='description']").val("");
    $("input[type='file']").attr("src","");
}
function modalBurger(){
    var modal = $("div[id='myModalBurger']");
    var btn = $("button[id='myBtnBrg']");
    var span = $("span[class='close'][id='burger']");
    btn.attr("onclick","popupShowHideBurger('block')");       
    span.attr("onclick","popupShowHideBurger('none')");
    $(window).click(function(event) {
        console.log(event.target.nodeName);
        if (event.target.nodeName == "DIV") {
            popupShowHideBurger("none");
        }
    });
}


function listBurgers(){
    
    $("div[name='user']").hide();
    $("div[name='place']").hide();
    $("div[name='burger']").show();
    reqUser = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/burgers";
    reqUser.open("GET", url, true);
    reqUser.setRequestHeader("Content-Type", window.location.pathname)
    reqUser.send();
    reqUser.onreadystatechange = function () {
        if (reqUser.readyState == 4 && reqUser.status == 200) {
            var json = JSON.parse(reqUser.responseText);
            var userDatas = "";
            var count = 0;
            json.forEach(function (element) {
                burgerIDList[count] = element.burgerID;
                count++;
                var bgcolor ="";
                var deleteBurgerButton = "delete";
                var deleteBurgerIcon ="trash";
                if (element.visible == 0){
                    bgcolor = "#ffd3d3";
                    deleteBurgerButton = "reset"; 
                    deleteBurgerIcon = "refresh";
                }
                userDatas += "<tr "+bgcolor+" class='tbl-brg' id="+element.burgerID+" bgcolor='"+bgcolor+"'><td width='5%'>" + element.burgerID +
                            "</td><td width='15%' value='"+element.burgerName+"'>" + element.burgerName +
                            "</td><td width='15%' value='"+element.placeID+"'>" + element.placeName +
                            "</td><td width='50%' value='desc'><textarea class='form-control' rows='5' readonly>" + element.description + "</textarea>" +
                            "</td><td width='20%' value='img'><img src='" + element.image + "'></td>"+
                            "<td width='10%' style='text-align:left' id="+element.burgerID+" name='modify' >"+
                                "<button type='edit' class='btn btn-warning' name='read' id = '" + element.burgerID + "' onclick='editBurger(" + element.burgerID + ")'>"+
                                    "<span color='white' class='glyphicon glyphicon-edit' aria-hidden='true'></span>"+
                                "</button> "+
                                "<button type='update' class='btn btn-success' name='update' style='display:none;' id = '" + element.burgerID + "' onclick ='updateBurger(" + element.burgerID + ")'>"+
                                    "<span class='glyphicon glyphicon-upload' aria-hidden='true'></span>"+
                                "</button> "+
                                "<button type='delete' class='btn btn-danger' name='delete' style='display:none;' id = '" + element.burgerID + "' onclick='"+deleteBurgerButton+"Burger(" + element.burgerID + ")'>"+
                                    "<span class='glyphicon glyphicon-"+deleteBurgerIcon+"' aria-hidden='true'></span>"+
                                "</button>"+
                            "</td>"+
                            // "<td id="+element.userID+" name='update' style='display:none;'><button id = '" + element.userID + "' onclick ='update(" + element.userID + ")'>Update</button></td>"+
                            // "<td id="+element.userID+" name='delete' style='display:none;'><button id = '" + element.userID + "' onclick ='deleteUser(" + element.userID + ")'>Delete</button></td>"+
                            "<td id="+element.burgerID+" name='response' style='display:none;'></td></tr>";
            }, this);
            document.querySelector('.jsonBurger').innerHTML = userDatas;
        }
    }
}


function addBurger(){
    document.querySelector("div[name='err_burgerName']").innerHTML = "";
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/burgers/post";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    var burgerName = $("input[type='burgerName']").val();
    var placeID = $("select[type='placeName']").val();
    var description = $("textarea[type='description']").val();
    var image = $("input[type='file']").attr("src");
    burgerName = burgerName == "" ? null: burgerName;
    placeID = placeID == "" ? null: placeID;
    description = description == "" ? null: description;
    image = image == "" ? null: image;
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                document.querySelector("div[name='err_userName']").innerHTML = "";
                document.querySelector("div[name='err_email']").innerHTML = "";
                    if(req.responseText=="OK"){
                        $("input[type='burgerName']").val("");
                        $("span[ng-show='myForm.email.$error.email']").text("")
                        popupShowHideBurger("none");
                        alert("Burger added to the database!");
                        listBurgers();
                    }else if(req.responseText=="Duplicate"){
                        var errArray = req.responseText.split("'");
                        var duplField = errArray[errArray.length-2];
                        var messageNode = "<h5 class='err'><font color='red'>The "+duplField.toLowerCase()+" is already taken!</font></h5>";
                        console.log(messageNode);
                        document.querySelector("div[name='err_burgerName']").innerHTML = messageNode;
                    }else if(req.responseText=="Empty"){
                        var messageNode = "<h5 class='err'><font color='red'>Please fill all the fields!</font></h5>";
                        console.log(messageNode);
                        document.querySelector("div[name='err_burgerName']").innerHTML = messageNode;
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
            "burgerName": burgerName,
            "placeID": placeID,
            "description": description,
            "image": image
        }
    );
    req.send(data);
}

function editBurger(burgerID){
    stopEditAllBurgers();
    var rowTds = $("tr[class='tbl-brg'][id='"+burgerID+"']").find("td");
    getPlaceNames(burgerID);
    $("button[type='edit'][id="+burgerID+"]").attr("onclick", "stopEditBurger("+burgerID+")");
    $("button[type='edit'][id="+burgerID+"]").attr("name", "edit");
    $("button[type='update'][id="+burgerID+"]").show();
    $("button[type='delete'][id="+burgerID+"]").show();
    $("button[type='edit'][id="+burgerID+"]").attr("class","btn btn-info");
    var burgerName = rowTds.eq(1).text();
    var placeID = rowTds.eq(2).attr("value");
    var placeName = rowTds.eq(2).text();
    var description = rowTds.eq(3).text();
    var image = rowTds.eq(4).find("img").attr("src")
    rowTds.eq(1).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='burgerName' raw='"+burgerName+"' value='"+burgerName+"'>");
    rowTds.eq(2).html("<select class='form-control input-sm' style='box-sizing : border-box;' type='text' name='placeName' raw='"+placeName+"' value='"+placeID+"'>");
    rowTds.eq(4).html("<input class='form-control' id='inp' type='file' raw='"+image+"' src='"+image+"'><br>");
    //rowTds.eq(4).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='lastName' raw='"+email+"' value='"+email+"'>");
    
    readFile();
    
    document.getElementById("inp").addEventListener("change", readFile);
    rowTds.eq(3).find("textarea").removeAttr("readonly")
    rowTds.eq(3).find("textarea").attr("raw",description);
    getPlaceNames(burgerID);
    $("td[name='update'][id="+burgerID+"]").show()
    $("td[name='delete'][id="+burgerID+"]").show()
}
function stopEditBurger(burgerID){
    $("button[type='edit'][id="+burgerID+"]").attr("onclick", "editBurger("+burgerID+")");
    $("button[type='edit'][id="+burgerID+"]").attr("name", "read");
    $("button[type='update'][id="+burgerID+"]").hide();
    $("button[type='delete'][id="+burgerID+"]").hide();
    $("button[type='edit'][id="+burgerID+"]").attr("class","btn btn-warning");
        var rowTds = $("tr[class='tbl-brg'][id='"+burgerID+"']").find("td");
        var burgerName = rowTds.eq(1).find("input").attr("raw");
        var placeName = rowTds.eq(2).find("select").attr("raw");
        var description = rowTds.eq(3).find("textarea").html();
        var image = rowTds.eq(4).find("input").attr("raw");
        rowTds.eq(1).html(burgerName);
        rowTds.eq(2).html(placeName);
        rowTds.eq(3).find("textarea").val(rowTds.eq(3).find("textarea").attr("raw"))
        rowTds.eq(3).find("textarea").attr("readonly","readonly");
        rowTds.eq(4).html("<img src='" + image + "'>");
    $("td[name='update'][id="+burgerID+"]").hide()
    $("td[name='delete'][id="+burgerID+"]").hide()
    $("td[name='response'][id="+burgerID+"]").hide()
    //$("th:contains('Modify')").hide();
    //$("th:contains('Delete')").hide();
}


function updateBurger(burgerID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/burgers/update";
    req.open("PUT", url, true);
    req.setRequestHeader("Content-type", "application/json");
    var burgerName = $("tr[id="+burgerID+"][class='tbl-brg']").find("td").eq(1).find("input").val()
    var placeID = $("tr[id="+burgerID+"][class='tbl-brg']").find("td").eq(2).find("select").val()
    var description = $("tr[id="+burgerID+"][class='tbl-brg']").find("td").eq(3).find("textarea").val();
    var image = $("tr[id="+burgerID+"][class='tbl-brg']").find("td").eq(4).find("input").attr("src");
    burgerName = burgerName == "" ? null: burgerName;
    placeID = placeID == "" ? null: placeID;
    description = description == "" ? null: description;
    
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                console.log(req.responseText)
                    if(req.responseText=="OK"){
                        updateViewBurger(burgerID);
                        $("tr[class='tbl-brg'][id="+burgerID+"]").attr("bgcolor","#f7fff4")
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
            "burgerID": burgerID,
            "burgerName": burgerName,
            "placeID": placeID,
            "description": description,
            "image": image
        }
    );
    req.send(data);
}

function updateViewBurger(burgerID){
    $("button[type='edit'][id="+burgerID+"]").attr("onclick", "editBurger("+burgerID+")");
    $("button[type='edit'][id="+burgerID+"]").attr("name", "read");
    $("button[type='update'][id="+burgerID+"]").hide();
    $("button[type='delete'][id="+burgerID+"]").hide();
    $("button[type='edit'][id="+burgerID+"]").attr("class","btn btn-warning");
        var rowTds = $("tr[class='tbl-brg'][id='"+burgerID+"']").find("td");
        var burgerName = rowTds.eq(1).find("input").val();
        var placeName = rowTds.eq(2).find("select").find(":selected").text();
        var description = rowTds.eq(3).find("textarea").val();
        var image = rowTds.eq(4).find("input").attr("src");
        rowTds.eq(1).html(burgerName);
        rowTds.eq(2).html(placeName);
        rowTds.eq(3).find("textarea").attr("readonly","readonly");
        rowTds.eq(4).html("<img src='" + image + "'>");
    $("td[name='update'][id="+burgerID+"]").hide()
    $("td[name='delete'][id="+burgerID+"]").hide()
    $("td[name='response'][id="+burgerID+"]").hide()
}

function getPlaceNames(burgerID){
    reqUser = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places";
    reqUser.open("GET", url, true);
    reqUser.setRequestHeader("Content-Type", window.location.pathname)
    reqUser.send();
    var places =  [];
    reqUser.onreadystatechange = function () {
        if (reqUser.readyState == 4 && reqUser.status == 200) {
            var json = JSON.parse(reqUser.responseText);
            var i = 0;
            var options = "";
            json.forEach(function (element) {
                places[i] = element;
                options += "<option value='"+element.placeID+"'>"+element.placeName+"</option>";
                i++;
            });
            //console.log(places)
            $("tr[class='tbl-brg'][id='"+burgerID+"']").find("select").html(options);
            $("tr[class='tbl-brg'][id='"+burgerID+"']").find("select").val($("tr[class='tbl-brg'][id='"+burgerID+"']").find("select").attr("value"))
        }
    }

}

function getPlaceNamesNewBurger(){
    reqUser = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/places";
    reqUser.open("GET", url, true);
    reqUser.setRequestHeader("Content-Type", window.location.pathname)
    reqUser.send();
    var places =  [];
    console.log("start")
    reqUser.onreadystatechange = function () {
        console.log(reqUser.readyState+" ")
        if (reqUser.readyState == 4 && reqUser.status == 200) {
            console.log("osssk")
            var json = JSON.parse(reqUser.responseText);
            var i = 0;
            var options = "";
            json.forEach(function (element) {
                places[i] = element;
                options += "<option value='"+element.placeID+"'>"+element.placeName+"</option>";
                i++;
            });
            
            $("select[name='placeName']").html(options);
        }
    }

}
function deleteBurger(burgerID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/burgers/"+burgerID;
    req.open("DELETE", url, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            if(req.responseText=="OK"){
                console.log("SUCCESS");
                stopEditBurger(burgerID);
                $("tr[class='tbl-brg'][id="+burgerID+"]").attr("bgcolor","#ffd3d3")
            }else if(req.responseText=="Error"){
                console.log("Hiba");
                makeBurgerInvisible(burgerID);
                $("tr[class='tbl-brg'][id="+burgerID+"]").attr("bgcolor","#ffd3d3")
                
            }
        }
    }
}

function makeBurgerInvisible(burgerID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/burgers/invisible";
    req.open("PUT", url, true);
    req.setRequestHeader("Content-type", "application/json");    
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText)
            stopEditBurger(burgerID);
            $("button[name='delete'][id="+burgerID+"]").attr("onclick","resetBurger("+burgerID+")")
            $("button[name='delete'][id="+burgerID+"]").find("span").attr("class","glyphicon glyphicon-refresh")
        }
    }
    var data = JSON.stringify(
        {
            "burgerID": burgerID
        }
    );
    req.send(data);
}


function resetBurger(burgerID){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/burgers/visible";
    req.open("PUT", url, true);
    req.setRequestHeader("Content-type", "application/json");    
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText)
            stopEditBurger(burgerID);
            $("tr[class='tbl-brg'][id="+burgerID+"]").attr("bgcolor","")
            $("button[name='delete'][id="+burgerID+"]").attr("onclick","deleteBurger("+burgerID+")")
            $("button[name='delete'][id="+burgerID+"]").find("span").attr("class","glyphicon glyphicon-trash")
            
        }
    }
    var data = JSON.stringify(
        {
            "burgerID": burgerID
        }
    );
    req.send(data);
}

function readFile() {
    
    if (this.files && this.files[0]) {
      var FR= new FileReader();
      FR.addEventListener("load", function(e) {
        document.getElementById("inp").src = e.target.result;
    });   
    FR.readAsDataURL( this.files[0] );
    }
    
  }

  function readFileNew() {
    
    if (this.files && this.files[0]) {
      var FR= new FileReader();
      FR.addEventListener("load", function(e) {
        document.getElementById("inpNew").src = e.target.result;
    });   
    FR.readAsDataURL( this.files[0] );
    }
    
  }
