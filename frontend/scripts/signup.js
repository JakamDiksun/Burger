
$( document ).ready(function() {
function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("img").src       = e.target.result;
      document.getElementById("b64").innerHTML = e.target.result;
      $("div[name='image']").show();
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("inp").addEventListener("change", readFile);
if(document.getElementById("img").src==""){
    $("div[name='image']").hide();
}
});



  function doRegister(){
        document.querySelector("div[name='err_userName']").innerHTML = "";
        document.querySelector("div[name='err_email']").innerHTML = "";
            req = new XMLHttpRequest();
            var ip = location.host;
            var url = "http://"+ip+"/users/post";
            req.open("POST", url, true);
            req.setRequestHeader("authtoken", getCookie("token"))
            req.setRequestHeader("Content-type", "application/json");
            var firstName = $("input[type='name1']").val();
            var lastName = $("input[type='name2']").val();
            var userName = $("input[type='user']").val();
            var email = $("input[type='email']").val();
            var password =  $("input[type='password']").val();
            var image = $("img[type='profile']").attr("src").replace("data:image/jpeg;base64,","");
            firstName = firstName == "" ? null: firstName;
            lastName = lastName == "" ? null: lastName;
            userName = userName == "" ? null: userName;
            email = email == "" ? null: email;
            password = password == "" ? null: password;
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                        document.querySelector("div[name='err_userName']").innerHTML = "";
                        document.querySelector("div[name='err_email']").innerHTML = "";
                    
                         if(req.responseText=="OK"){
                             alert("Registration was successful!");
                             window.location = "http://"+ip+"/index.html";
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
                    "firstName": firstName,
                    "lastName": lastName,
                    "userName": userName,
                    
                    "email": email,
                    "password": password,
                    "image": image
                }
            );
            // //console.log(userData);
            req.send(userData);
      
  }

  
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}