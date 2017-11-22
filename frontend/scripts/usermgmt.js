var userIDList = [];

function stopEditAllUsers(){
    ////console.log(burgerIDList)
    userIDList.forEach(function(element) {
        if($("button[type='edit'][id='"+element+"']").attr("name") == "edit")
        stopEditUser(element);
    });
}

function popupShowHide(action){
    $("div[id='myModal']").css("display",action);
    $("input[type='email']").val("");
    $("input[type='password']").val("");
}
function modal(){
    var modal = $("div[id='myModal']");
    var btn = $("button[id='myBtn']");
    var span = $("span[class='close']");
    btn.attr("onclick","popupShowHide('block')");       
    span.attr("onclick","popupShowHide('none')");
    $(window).click(function(event) {
        console.log(event.target.nodeName);
        if (event.target.nodeName == "DIV" || event.target.nodeName == "CENTER") {
            popupShowHide("none");
        }
    });
}
function listUsers(){
    $("div[name='user']").show();
    $("div[name='place']").hide();
    $("div[name='burger']").hide();
    reqUser = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/users";
    reqUser.open("GET", url, true);
    reqUser.setRequestHeader("Content-Type", window.location.pathname)
    reqUser.send();
    reqUser.onreadystatechange = function () {
        if (reqUser.readyState == 4 && reqUser.status == 200) {
            var json = JSON.parse(reqUser.responseText);
            var userDatas = "";
            var count = 0;
            json.forEach(function (element) {
                var permission = "";
                userIDList[count] = element.userID;
                count++;
                switch (element.permission) {
                    case 0:  permission = "Deleted"; break;
                    case 1:  permission = "User"; break;
                    case 2:  permission = "Administrator"; break;
                    case 3:  permission = "Manager"; break;         
                }
                var bgcolor ="";
                if (element.permission==0){
                    bgcolor = "bgcolor='#ffd3d3'";
                }           
                userDatas += "<tr "+bgcolor+" class='tbl' id="+element.userID+"><td width='5%'>" + element.userID +
                            "</td><td width='15%' value='"+element.userName+"'>" + element.userName +
                            "</td><td width='15%' value='"+element.firstName+"'>" + element.firstName +
                            "</td><td width='15%' value='"+element.lastName+"'>" + element.lastName +
                            "</td><td width='15%' value='"+element.email+"'>" + element.email + "</td>"+
                            "</td><td width='15%' value='"+permission+"'>" + permission + "</td>"+
                            "</td><td width='10%' value='"+element.image+"'><img style='width:50px;' src='/avatars/"+element.image+".png'></td>"+
                            "<td width='10%' style='text-align:left' id="+element.userID+" name='modify' >"+
                                "<button type='edit' class='btn btn-warning' name='read' id = '" + element.userID + "' onclick='editUser(" + element.userID + ")'>"+
                                    "<span color='white' class='glyphicon glyphicon-edit' aria-hidden='true'></span>"+
                                "</button> "+
                                "<button type='update' class='btn btn-success' name='update' style='display:none;' id = '" + element.userID + "' onclick ='update(" + element.userID + ")'>"+
                                    "<span class='glyphicon glyphicon-upload' aria-hidden='true'></span>"+
                                "</button> "+
                                "<button type='delete' class='btn btn-danger' name='delete' style='display:none;' id = '" + element.userID + "' onclick='deleteUser(" + element.userID + ")'>"+
                                    "<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>"+
                                "</button>"+
                            "</td>"+
                            // "<td id="+element.userID+" name='update' style='display:none;'><button id = '" + element.userID + "' onclick ='update(" + element.userID + ")'>Update</button></td>"+
                            // "<td id="+element.userID+" name='delete' style='display:none;'><button id = '" + element.userID + "' onclick ='deleteUser(" + element.userID + ")'>Delete</button></td>"+
                            "<td id="+element.userID+" name='response' style='display:none;'></td></tr>";
            }, this);
            document.querySelector('.jsonUser').innerHTML = userDatas;
        }
    }
}

function editUser(userID){
    stopEditAllUsers();
    $("button[type='edit'][id="+userID+"]").attr("onclick", "stopEditUser("+userID+")");
    $("button[type='edit'][id="+userID+"]").attr("name", "edit");
    $("button[type='update'][id="+userID+"]").show();
    $("button[type='delete'][id="+userID+"]").show();
    $("button[type='edit'][id="+userID+"]").attr("class","btn btn-info");
    var rowTds = $("tr[class='tbl'][id='"+userID+"']").find("td");
    var userName = rowTds.eq(1).text();
    var firstName = rowTds.eq(2).text();
    var lastName = rowTds.eq(3).text();
    var email = rowTds.eq(4).text();
    var permission = rowTds.eq(5).attr("value");
    var permissionName = rowTds.eq(5).text();
    var avatar = rowTds.eq(6).find("img").attr("src").replace("/avatars/","").replace(".png","")
    avatar = avatar != "null" ? avatar : ""; 
    rowTds.eq(1).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='userName' raw='"+userName+"' value='"+userName+"'>");
    rowTds.eq(2).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='firstName' raw='"+firstName+"' value='"+firstName+"'>");
    rowTds.eq(3).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='lastName' raw='"+lastName+"' value='"+lastName+"'>");
    rowTds.eq(4).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='lastName' raw='"+email+"' value='"+email+"'>");
    var permissionList = "<select class='form-control input-sm' name='permission' raw='"+permissionName+"' id='" + userID + "'>";
    if (permission == 0){
        permissionList += "<option value='0'>Deleted</option>";
    }
    permissionList += "<option value='1'>User</option><option value='2'>Administrator</option><option value='3'>Manager</option>";
    rowTds.eq(5).html(permissionList);
    rowTds.eq(6).html("<input class='form-control input-sm' style='box-sizing : border-box;' type='text' name='avatar' raw='"+avatar+"' value='"+avatar+"'>");
    $("select[name='permission'][id="+userID+"]").find("option:contains("+permission+")").attr('selected', true);
    $("td[name='update'][id="+userID+"]").show()
    $("td[name='delete'][id="+userID+"]").show()
}

function stopEditUser(userID){
    $("button[type='edit'][id="+userID+"]").attr("onclick", "editUser("+userID+")");
    $("button[type='edit'][id="+userID+"]").attr("name", "read");
    $("button[type='update'][id="+userID+"]").hide();
    $("button[type='delete'][id="+userID+"]").hide();
    $("button[type='edit'][id="+userID+"]").attr("class","btn btn-warning");
        var rowTds = $("tr[class='tbl'][id='"+userID+"']").find("td");
        var userName = rowTds.eq(1).find("input").attr("raw");
        var firstName = rowTds.eq(2).find("input").attr("raw");
        var lastName = rowTds.eq(3).find("input").attr("raw");
        var email = rowTds.eq(4).find("input").attr("raw");
        var permission = rowTds.eq(5).find("select").attr("raw");
        var avatar = rowTds.eq(6).find("input").attr("raw");
        rowTds.eq(1).html(userName);
        rowTds.eq(2).html(firstName);
        rowTds.eq(3).html(lastName)
        rowTds.eq(4).html(email);
        rowTds.eq(5).html(permission);
        rowTds.eq(6).html("<img style='width:50px;' src='/avatars/"+avatar+".png'>");
        $("select[name='permission'][id="+userID+"]").find("option[value="+permission+"]").attr('selected', true);
    $("td[name='update'][id="+userID+"]").hide()
    $("td[name='delete'][id="+userID+"]").hide()
    $("td[name='response'][id="+userID+"]").hide()
    //$("th:contains('Modify')").hide();
    //$("th:contains('Delete')").hide();
}
function updateView(userID){
    $("button[type='edit'][id="+userID+"]").attr("onclick", "editUser("+userID+")");
    $("button[type='edit'][id="+userID+"]").attr("name", "read");
    $("button[type='update'][id="+userID+"]").hide();
    $("button[type='delete'][id="+userID+"]").hide();
    $("button[type='edit'][id="+userID+"]").attr("class","btn btn-warning");
        var rowTds = $("tr[class='tbl'][id='"+userID+"']").find("td");
        var userName = rowTds.eq(1).find("input").val();
        var firstName = rowTds.eq(2).find("input").val();
        var lastName = rowTds.eq(3).find("input").val();
        var email = rowTds.eq(4).find("input").val();
        var permission = rowTds.eq(5).find(":selected").text();
        var image = rowTds.eq(6).find("input").val();
        rowTds.eq(1).html(userName);
        rowTds.eq(2).html(firstName);
        rowTds.eq(3).html(lastName)
        rowTds.eq(4).html(email);
        rowTds.eq(5).html(permission);
        $("select[name='permission'][id="+userID+"]").find("option[value="+permission+"]").attr('selected', true);
        rowTds.eq(6).html("<img style='width:50px;' src='/avatars/"+image+".png'>");
    $("td[name='update'][id="+userID+"]").hide()
    $("td[name='delete'][id="+userID+"]").hide()
    $("td[name='response'][id="+userID+"]").hide()
}


function addUser(){
    document.querySelector("div[name='err_userName']").innerHTML = "";
    document.querySelector("div[name='err_email']").innerHTML = "";
    //document.querySelector("div[name='err_company']").innerHTML = "";
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/users/post";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    var firstName = $("input[type='name1']").val();
    var lastName = $("input[type='name2']").val();
    var userName = $("input[type='user']").val();
    var email = $("input[type='email']").val();
    var password =  $("input[type='password']").val();
    var image = $("div.avatar").attr("id");
    //var companyID = $("select[name='company_list']").find(":selected").val();
    userName = userName == "" ? null: userName;
    email = email == "" ? null: email;
    password = password == "" ? null: password;
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                document.querySelector("div[name='err_userName']").innerHTML = "";
                document.querySelector("div[name='err_email']").innerHTML = "";
                //document.querySelector("div[name='err_company']").innerHTML = "";
                    if(req.responseText=="OK"){
                        $("input[type='user']").val("");
                        //   $("select[name='company'] option[value=1]").attr("selected",true);
                        $("span[ng-show='myForm.email.$error.email']").text("")
                        popupShowHide("none");
                        alert("User added to the database!");
                        listUsers();
                    }else if(req.responseText=="Duplicate"){
                        var errArray = req.responseText.split("'");
                        var duplField = errArray[errArray.length-2];
                        var messageNode = "<h5 class='err'><font color='red'>The "+duplField.toLowerCase()+" is already taken!</font></h5>";
                        console.log(messageNode);
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
    var userData = JSON.stringify(
        {
            "userName": userName,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password,
            "image": image
        }
    );
    req.send(userData);
}

function update(userID){
        req = new XMLHttpRequest();
        var ip = location.host;
        var url = "http://"+ip+"/users/update";
        req.open("PUT", url, true);
        req.setRequestHeader("Content-type", "application/json");
        var userName = $("tr[id="+userID+"][class='tbl']").find("td").eq(1).find("input").val()
        var firstName = $("tr[id="+userID+"][class='tbl']").find("td").eq(2).find("input").val()
        var lastName = $("tr[id="+userID+"][class='tbl']").find("td").eq(3).find("input").val()
        var email = $("tr[id="+userID+"][class='tbl']").find("td").eq(4).find("input").val()
        var permission = $("tr[id="+userID+"][class='tbl']").find("td").eq(5).find(":selected").val()
        var image = $("tr[id="+userID+"][class='tbl']").find("td").eq(6).find("input").val()
        userName = userName == "" ? null: userName;
        firstName = firstName == "" ? null: firstName;
        lastName = lastName == "" ? null: lastName;
        email = email == "" ? null: email;
        permission = permission == "" ? null: permission;
        image = image == "" ? null: image;
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                    //document.querySelector("div[name='err_userName']").innerHTML = "";
                    //document.querySelector("div[name='err_email']").innerHTML = "";
                    //document.querySelector("div[name='err_company']").innerHTML = "";
                    console.log(req.responseText)
                        if(req.responseText=="OK"){
                            updateView(userID);
                            $("tr[class='tbl'][id="+userID+"]").attr("bgcolor","#f7fff4")
                        }else if(req.responseText=="Empty"){
                            var messageNode = "<h5 style='width: 200px;' class='err'><font color='red'>Please fill all the fields!</font></h5>";
                            console.log(messageNode);
                            //$("td[name='response'][id="+userID+"]").html(messageNode);
                            //$("td[name='response'][id="+userID+"]").show();
                        
                            alert("Please fill all the fields!");
                        }else{
                            //console.log(req.responseText);
                            var errArray = req.responseText.split("'");
                            var duplField = errArray[errArray.length-2];
                            //console.log(errArray);
                            //var messageNode = "<h5 style='width: 250px;' class='err'><font color='red'>The "+duplField.toLowerCase()+" is already taken!</font></h5>";
                            //console.log(messageNode);
                            //$("td[name='response'][id="+userID+"]").html(messageNode);
                            //$("td[name='response'][id="+userID+"]").show();
                            alert("The "+duplField.toLowerCase()+" is already taken!");
                            //document.querySelector("div[name='err_"+duplField+"']").innerHTML = messageNode;
                    }
            }
        }
        var userData = JSON.stringify(
            {
                "userID": userID,
                "firstName": firstName,
                "lastName": lastName,
                "userName": userName,
                "email": email,
                "permission": permission,
                "image": image
            }
        );
        req.send(userData);
}

function deleteUser(userID){
        req = new XMLHttpRequest();
        var ip = location.host;
        var url = "http://"+ip+"/users/"+userID;
        req.open("DELETE", url, true);
        req.send(); 
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                console.log(req.responseText)
                if(req.responseText=="OK"){
                    console.log("SUCCESS");
                    stopEditUser(userID);
                    $("tr[class='tbl'][id="+userID+"]").attr("bgcolor","#ffd3d3")
                }else if(req.responseText=="DELETE"){
                    console.log("Hiba");
                }
            }
        }
        
    }