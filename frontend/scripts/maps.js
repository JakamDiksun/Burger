reqRegistry = new XMLHttpRequest();
var locations = [];
var registryID = [];
var images = [];
var placeName = [];
var productName = [];
var companyName = [];
var categoryName = [];
var price = [];
var comment = [];
var date = [];
var placeID =[];


    filter()

 


function filter() {
    var req = new XMLHttpRequest();
    var ip = location.host;
    var id = getUrlVars().Pid != null ? "/"+ getUrlVars().Pid : ""; 
    var url = "http://" + ip + "/places"+id;
    var datas = "";
    req.open("get", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("authtoken", getCookie("token"))
    req.send();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            locations = [];
            images = [];
            placeName = [];
            placeID =[];
            // productName = [];
            // companyName = [];
            categoryName = [];
            childCategoryName = [];
            topicName = [];
            // price = [];
            comment = [];
            date = [];
            registryID = [];
            var json = JSON.parse(req.responseText);
            var x,y;
            json.forEach(function(element) {
                placeName.push(element.placeName);
                placeID.push(element.placeID);
                comment.push(element.description);

                images.push("<img class='place' alt='test.jpg' src='" + element.image + "'>");
                var tmp = {
                    lat: element.gpsX,
                    lng: element.gpsY
                };
                //console.log(element.gpsX+", "+element.gpsY)
                x = element.gpsX;
                y = element.gpsY;
                locations.push(tmp);
            }, this);
            if(getUrlVars().Pid){
                initMapOne(x,y);
            }else{
                initMap();
            }
        }
    }
}

function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(47.470314, 19.059549),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("sample"), mapOptions);
}


function initMap() {
    var map = new google.maps.Map(document.getElementById('sample'), {
        zoom: 13,
        center: {
            lat: 47.494599,
            lng:  19.087718
        }
    });
    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var markers = locations.map(function(location, i, images) {
        return new google.maps.Marker({
            position: location,
            //label: labels[i % labels.length],
            //label: registryID[i],
        });
    });
    var markerCluster = new MarkerClusterer(map, markers, {
        maxZoom: 12,
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
    var i = 0;
    markers.forEach(function(element) {
        var contentString = '<div id="content">' +
            '<div>' +
            "<table style='width:100px;height:100px;'>" +
            "<tr><td rowspan='6'>" +
            images[i] +
            "</td></tr>" +
            "<tr><td>Place name: </br></br><a  href='placepage.html?Pid="+placeID[i]+"'><b style='font-size:20px;'>" + placeName[i] + "</b></a></td></tr>" +
            "<tr><td><hr></td><td><hr></td></tr>" +
           //"<tr><td>Date: </br><b>" + date[i].split('T')[0] + "</b></td></tr>" +
            "<tr><td colspan='2'><div  style='height:180px;width:200px;overflow-y: scroll;padding:0 15px;'>Comment: <br>" + comment[i] + "</div></td></tr>" +
            "</table>" +
            '</div>';
        i++;
        var infowindow = new google.maps.InfoWindow({
            content: contentString,

        });
        element.addListener('click', function() {
            infowindow.open(map, element);
        });
    }, this);

}
function initMapOne(x,y) {
    var map = new google.maps.Map(document.getElementById('sample'), {
        zoom: 13,
        center: {
            lat: x,
            lng:  y
        }
    });
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var markers = locations.map(function(location, i, images) {
        return new google.maps.Marker({
            position: location,
        });
    });
    var markerCluster = new MarkerClusterer(map, markers, {
        maxZoom: 12,
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
    var i = 0;
    markers.forEach(function(element) {
        var contentString = '<div id="content">' +
            '<div>' +
            "<table style='width:100px;height:100px;'>" +
            "<tr><td rowspan='6'>" +
            images[i] +
            "</td></tr>" +
            "<tr><td>Place name: </br></br><a  href='placepage.html?Pid="+placeID[i]+"'><b style='font-size:20px;'>" + placeName[i] + "</b></a></td></tr>" +
            "<tr><td><hr></td><td><hr></td></tr>" +
            "<tr><td colspan='2'><div  style='height:180px;width:200px;overflow-y: scroll;padding:0 15px;'>Comment: <br>" + comment[i] + "</div></td></tr>" +
            "</table>" +
            '</div>';
        i++;
        var infowindow = new google.maps.InfoWindow({
            content: contentString,

        });
        element.addListener('click', function() {
            infowindow.open(map, element);
        });
    }, this);

}
/*var locations = [
  {lat: -31.563910, lng: 147.154312},
  {lat: -33.718234, lng: 150.363181},
  {lat: -33.727111, lng: 150.371124},
  {lat: -33.848588, lng: 151.209834},
  {lat: -33.851702, lng: 151.216968},
  {lat: -34.671264, lng: 150.863657},
  {lat: -35.304724, lng: 148.662905},
  {lat: -36.817685, lng: 175.699196},
  {lat: -36.828611, lng: 175.790222},
  {lat: -37.750000, lng: 145.116667},
  {lat: -37.759859, lng: 145.128708},
  {lat: -37.765015, lng: 145.133858},
  {lat: -37.770104, lng: 145.143299},
  {lat: -37.773700, lng: 145.145187},
  {lat: -37.774785, lng: 145.137978},
  {lat: -37.819616, lng: 144.968119},
  {lat: -38.330766, lng: 144.695692},
  {lat: -39.927193, lng: 175.053218},
  {lat: -41.330162, lng: 174.865694},
  {lat: -42.734358, lng: 147.439506},
  {lat: -42.734358, lng: 147.501315},
  {lat: -42.735258, lng: 147.438000},
  {lat: -43.999792, lng: 170.463352}
]*/




function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}
