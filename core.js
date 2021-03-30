var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
setTimeout(startNav, 1500);
document.getElementById("map").style.height = "0" ;
mapboxgl.accessToken = key;
var mapStyle = "mapbox://styles/oxey405/ckmwe9yas0i0t17o3s2io2xah";
var rqstURL = `http://ip-api.com/json/`;
var rqst = new XMLHttpRequest();
rqst.open("GET", rqstURL);
rqst.responseType = "json";
function startNav() {
  document.getElementById("map").style.height = "100vh" ;
var toDelete = document.getElementsByClassName("to-delete");
for(i = 0; i < toDelete.length ; i++) {
  toDelete[i].remove();
}

rqst.send();


}
rqst.onload = function () {

  //choosing style with date time
  var date = new Date();
  var hour = date.getHours();
  if (hour > 19 || hour < 7) {
    var r = confirm("Do you want to get to dark style ?");
    if(r == true) {
      mapStyle = "mapbox://styles/oxey405/ckmw8ibz0195b17ntnwzypeg6";
    } else {
      mapStyle = "mapbox://styles/oxey405/ckmwe9yas0i0t17o3s2io2xah";
    }
    
  } else {
    mapStyle = "mapbox://styles/oxey405/ckmwe9yas0i0t17o3s2io2xah";
  }
  console.log(rqst.response);
  var lat = rqst.response["lat"];
  var lon = rqst.response["lon"];
  var map = new mapboxgl.Map({
    container: "map",
    style: mapStyle,
    center: [lon, lat],
    zoom: 20,
  });
  map.addControl(new mapboxgl.NavigationControl());
  map.on("load", function () {
    // Add an image to use as a custom marker
    map.loadImage("home.png", function (error, image) {
      //throwing errors
      if (error) throw error;
      map.addImage("custom-marker", image);
      // Add a GeoJSON source with 2 points
      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{ // features for the home marker
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            properties: {
              description: '<p style="color:black">This is your current position !</p>',
            },
          },],
        },
      });

      map.addLayer({
        id: "points",
        type: "symbol",
        source: "points",
        layout: {
          "icon-image": "custom-marker",
          // get the title name from the source's "title" property
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-anchor": "top",
        },
      });

  });
  // Add a symbol layer

  //adding the sky
  //on click on markers
  map.on('click', 'points', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'points', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'points', function () {
    map.getCanvas().style.cursor = '';
    });
  //add marker where clicked

  map.on("click", function (e) {
    //first we get position of the mouse
    var latOfPoint = e.lngLat["lat"];
    var lngOfPoint = e.lngLat["lng"];
    console.log("You selected" + latOfPoint + lngOfPoint);
  });
});
};
