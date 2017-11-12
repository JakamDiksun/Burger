
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
            json.forEach(function (element) {
                userDatas = `<table>
                <tr>
                    <td>
                        <img width = "100px;" src="avatars/`+element.image+`.png" alt="">
                    </td>
                    <td class="username">
                        `+element.userName+`'s profile
                    </td>
                </tr>
                <tr>
                    <td class="details" colspan="2">
                        <div class="ratings">Total ratings:</span>
                    <td>
                </tr>
                <tr>
                    <td class="fav" colspan="2">
                        <div class="fav">Favourite burger:</span>
                    <td>
                </tr>
            </table>`
                        }, this);
            document.querySelector('.jsonUser').innerHTML = userDatas;
        }
    }
}

/*

dasds = `<header class='profileHeader'>
<div class='avatarWrapper'>
   <img src='/avatars/`+element.image+`.png'>
</div>
<div class='usernameAndFollow'>
   <span class='username'>`+element.userName+`</span>
   &nbsp;<span class='hidden-sm hidden-md hidden-lg hidden-xl label label-edit' id='ajax-load-link'>
   <a h>Beer Cellar</a>
   </span>
   <div class='biography'> 
      <div></div>
      <div></div>
      <span class='glyphicon glyphicon-map-marker' aria-hidden='true'></span> Charlotte, North Carolina
   </div>
   <div id='ajax-load-link' class='hidden-xs user-stats-panel'>
      <ul class='statistics fullwidth'>
         <a >
            <li id='menu--ratings' style='background: rgb(247, 247, 247);'>
               <div class='stat-value' id='-ratings'>26054</div>
               <div class='stat-label'>
                  ratings
               </div>
            </li>
         </a>
         <a >
            <li id='menu--ratings' style='background: rgb(247, 247, 247);'>
               <div class='stat-value' id='-ratings'>75</div>
               <div class='stat-label'>
                  ticks
               </div>
            </li>
         </a>
         <a>
            <li id='menu-place-ratings' style='background: rgb(247, 247, 247);'>
               <div class='stat-value' id='place-ratings'>3048</div>
               <div class='stat-label'>
                  places
               </div>
            </li>
         </a>
      </ul>
   </div>
</div>
</header>`*/