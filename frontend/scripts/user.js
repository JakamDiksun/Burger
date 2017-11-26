


function getUserdatas(userID){
    reqUser = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/user/"+userID;
    reqUser.open("GET", url, true);
    reqUser.setRequestHeader("Content-Type", window.location.pathname)
    reqUser.send();
    reqUser.onreadystatechange = function () {
        if (reqUser.readyState == 4 && reqUser.status == 200) {
            var json = JSON.parse(reqUser.responseText);
            var userDatas = ""; 
            var edit = "";
            json.forEach(function (element) {
                if (element.userID == globalID){
                    edit = `<td>

                    <section class="save" style="display: none;">
                        <button class="rate" id="save" onclick="save()"><h1>Save</h1></button>
                    </section>
                    <section class="press" style="display: table-cell;margin-left:10px;">
                        <button class="rate" id="edit" onclick="editProfile();" style="margin-left:10px;"><h1>Edit</h1></button>
                    </section>
                    </td>`;
                }else{
                    $(".active").attr("class","");
                }
                userDatas = `<table id="datas" style="width:55%;">
                <tr>
                    <td id="avatar" value="`+element.image+`">
                        <img  width = "100px;" src="avatars/`+element.image+`.png" alt="">
                    </td>
                    <td class="username" id="username" value="`+element.userName+`" >
                        `+element.userName+`'s profile
                    </td>
                    `+edit+`
                </tr>
                <tr>
                    <td class="details">
                        <div class="name">Full name: </div>
                    </td>
                    <td class="details">
                        <b id="name" style="font-size:20px;" fname="`+element.firstName+`" lname="`+element.lastName+`">`+element.firstName+` `+element.lastName+`</b>
                    </td>
                </tr>
                <tr>
                    <td class="details">
                        <div class="email">Email: </div>
                    </td>
                    <td class="details">
                        <b id="email" style="font-size:20px;" value="`+element.email+`">`+element.email+`</b>
                    </td>
                </tr>
                <tr id='password' style="display:none;">
                    <td class="details">
                        New password
                    </td>
                    <td class="details">
                        <b style="font-size:20px;"><input placeholder='password' type='password' style='width:50%'></b> <small>You can type your old password too!</small>
                    <td>
                </tr>
                <tr>
                    <td class="details">
                        <div>Total ratings:</div>
                    </td>
                    <td class="details">
                        <div class="ratings"></div>
                    <td>
                </tr>
                <tr>
                    <td class="details" colspan="2">
                        <div class="fav">Comments:</div>
                    </td>
                </tr>
            </table>`
                        }, this);
            document.querySelector('.jsonUser').innerHTML = userDatas;
            
            getRatingsUser(userID);
        }
    }
}



function getRatingsUser(userID){
    reqUser = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/ratingsUser/"+userID;
    reqUser.open("GET", url, true);
    reqUser.setRequestHeader("Content-Type", window.location.pathname)
    reqUser.send();
    reqUser.onreadystatechange = function () {
        if (reqUser.readyState == 4 && reqUser.status == 200) {
            var json = JSON.parse(reqUser.responseText);
            var userDatas = "";
            var count = 0;
            json.forEach(function (element) {
                count ++;
                userDatas += `
                    <table id="`+element.ratingID+`">
                    <tr>
                    <td style="width:750px;">
                       <div style="padding: 0px 0px 0px 0px;">
                          <div style="width: 70px; float: left; padding-right: 10px;"></div>
                          <div style="display:inline; padding: 0px 0px; font-size: 24px; font-weight: bold; color: #036;"><a href="/burgerpage.html?Bid=`+element.burgerID+`">`+element.burgerName+`</a></div>
                       </div>
                       <small style="color: #666666; font-size: 12px; font-weight: bold;">TASTE: <b>` + element.pTaste + `&emsp;</b>PREPARE TIME: <b>` + element.pPrepareTime + 
                       `&emsp;</b> APPEARANCE: <b>` + element.pApperance + `</b></small>` +
                       `<div style='padding: 20px 10px 20px 0px; border-bottom: 1px solid #e0e0e0; line-height: 1.5;'>` + element.comment + `</div></small>
                    </td>
                    <td width="0%" valign="bottom" align="right"><small style="color:grey">2017-11-12 : 15:37:20</small></td>
                    <td>
                       <b class="likes">`+element.likes+` likes</b>
                    </td>
                 </tr>
                    </table>
                
                `;
                        }, this);
                        $(".ratings").html("<b style='font-size:20px;'>  "+count+"</b>");
            document.querySelector('.reviews-container').innerHTML = userDatas;

        }
    }
}
function editProfile(){
    var table = $("#datas")
    var avatar = $("#avatar");
    var avatarID = avatar.attr("value");
    var username = $("#username");
    var name = $("#name");
    var email = $("#email");
    var password = $("#password")
    var saveButton = $("#save")
    var editButton = $("#edit h1")
    saveButton.attr("style","margin-left:10px;")
    saveButton.parent().attr("style","display: table-cell;")
    saveButton.parent().show();
    editButton.text("Cancel");
    editButton.parent().attr("onclick","location.reload();")
    avatar.html(`<div>    
    <div style="padding-bottom: 20px;">Pick your avatar:  
        </div>      
    <table id="avatarPicker">
        <tr>
                <td><img id="1" src="/avatars/1.png" name="-" onclick="select(this);" class="avatar"></td>
                <td><img id="2" src="/avatars/2.png" name="-" onclick="select(this);" class="avatar"></td>
                <td><img id="3" src="/avatars/3.png" name="-" onclick="select(this);" class="avatar"></td>
                <td><img id="4" src="/avatars/4.png" name="-" onclick="select(this);" class="avatar"></td>
        </tr>
        <tr>
                <td><img id="5" src="/avatars/5.png" name="-" onclick="select(this);" class="avatar"></td>
                <td><img id="6" src="/avatars/6.png" name="-" onclick="select(this);" class="avatar"></td>
                <td><img id="7" src="/avatars/7.png" name="-" onclick="select(this);" class="avatar"></td>
                <td><img id="8" src="/avatars/8.png" name="-" onclick="select(this);" class="avatar"></td>
        </tr>
    </table>
    <div class="avatar" id="0" display="none;"></div>
    <!--<input class="form-control" id="inp" type='file'>-->
        <br>    
</div>`);
    username.html("<input placeholder='username' style='width:50%' value = '"+username.attr("value")+"'> 's profile")
    username.attr("style","width:50%");
    table.attr("style","width:75%");
    name.html("<input id='fname' placeholder='First name' style='width:25%' value='"+name.attr("fname")+"'><input id='lname' placeholder='Last name' style='width:25%' value='"+name.attr("lname")+"'>")
    email.html("<input placeholder='email' style='width:50%'  value='"+email.attr("value")+"'>")
    $("#avatarPicker img#"+avatarID+"").trigger("click")
    password.show();
}



function save(){
    req = new XMLHttpRequest();
    var ip = location.host;
    var url = "http://"+ip+"/users/myupdate";
    req.open("PUT", url, true);
    req.setRequestHeader("Content-type", "application/json");
    var userName = $("#username").find("input").val();
    var firstName = $("#name").find("input#fname").val();
    var lastName = $("#name").find("input#lname").val();
    var email = $("#email").find("input").val();
    var password = $("#password").find("input").val();
    var image = $("div.avatar").attr("id");
    userName = userName == "" ? null: userName;
    firstName = firstName == "" ? null: firstName;
    lastName = lastName == "" ? null: lastName;
    email = email == "" ? null: email;
    password = password == "" ? null: password;
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
                console.log(req.responseText)
                    if(req.responseText=="OK"){
                        location.reload();
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
            "userID": globalID,
            "firstName": firstName,
            "lastName": lastName,
            "userName": userName,
            "email": email,
            "password": password,
            "image": image
        }
    );
    req.send(userData);
}
