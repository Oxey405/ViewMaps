var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = key;

var rqstURL = `http://ip-api.com/json/`
var rqst = new XMLHttpRequest();
rqst.open('GET', rqstURL);
rqst.responseType = 'json';
rqst.send();
rqst.onload = function () { 
  console.log(rqst.response)
  var lat = rqst.response["lat"];
  var lon = rqst.response["lon"];
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/oxey405/ckmv08y6t02dw17ntg275l5x3',
    center: [lon, lat],
    zoom: 20
  });
  map.addControl(new mapboxgl.NavigationControl());
  map.on('load', function () {
    // Add an image to use as a custom marker
    map.loadImage(
    'home.png',
    function (error, image) {
    if (error) throw error;
    map.addImage('custom-marker', image);
    // Add a GeoJSON source with 2 points
    map.addSource('points', {
    'type': 'geojson',
    'data': {
    'type': 'FeatureCollection',
    'features': [
    {
    // feature for Mapbox SF
    'type': 'Feature',
    'geometry': {
    'type': 'Point',
    'coordinates': [lon, lat]
    },
    'properties': {
    'title': ''
    }
    }
    ]
    }
    });
     
    // Add a symbol layer
    map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'points',
    'layout': {
    'icon-image': 'custom-marker',
    // get the title name from the source's "title" property
    'text-field': ['get', 'title'],
    'text-font': [
    'Open Sans Semibold',
    'Arial Unicode MS Bold'
    ],
    'text-offset': [0, 1.25],
    'text-anchor': 'top'
    }
    });
    }
    );
    })};
