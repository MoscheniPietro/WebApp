const key="x-ebirdapitoken";
const key_value="{{x-ebirdapitoken}}"
let debug=1;
//const express = require('express');
//const app = express();
//const cors = require('cors');
//app.use(cors());


class weatherForecast
{
    constructor(spCode, comName, sciName, locId, locName, obsDt, hMany, lat, lng, obsValid, obsReviewed, sId)
    {
        this.speciesCode = spCode;
        this.commonName = comName;
        this.scientificName = sciName;
        this.locationId = locId;
        this.locationName = locName;
        this. observationDt = obsDt;
        this.howMany = hMany;
        this.latitude = lat;
        this.longitude = lng;
        this.observationValid = obsValid;
        this.observatinReviewed = obsReviewed;
        this.locationPrivate = locationPrivate;
        this.subId = sId;
      }
}

async function getCityByCoordinates ()
{
    console.log("Avvio get dalle coordinate"); 
    const locationBaseUrl = "https://api.ebird.org/v2/data/obs/geo/recent?";
    //const query = 'lat=' + currentCity.latitude.toFixed(2).toString() + '&lng=' + currentCity.longitude.toFixed(2).toString();
    const query = `lat=${currentCity.latitude.toFixed(2)}&lng=${currentCity.longitude.toFixed(2)}`;
    console.log(query);
    console.log(locationBaseUrl + query);
    const res = await fetch(locationBaseUrl + query, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest', // Questo header è richiesto dall'API di eBird
        'X-eBirdApiToken': 'x-ebirdapitoken', // Sostituisci con il tuo token API di eBird
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
      }
    });
    const tmpCity = await res.json()
    if (debug === 1) console.log(tmpCity);
    const {LocalizedName, Key} = tmpCity;

    //fill our city info
    currentCity.cityName = LocalizedName;
    currentCity.cityCode = Key;
    cities.push(currentCity);
    if (debug === 1) console.log(currentCity);
}

const url_carto_cdn = 'http://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

//connects from html element and script
const textContent = document.getElementById("content");
const search = document.getElementById("searchUser");
const weatherButton = document.getElementById("submit");
const image = document.querySelector(".image img");

let selectElement;
let decimals = 1;
var output;

var maxPercentage = 100;
/**
 * Click event listener
 */

// view
var myview = new ol.View({
        center: [1350766.668508934, 5177943.850979362], // map.getView().getCenter()
        zoom: 2,
    })

window.onload = init(); // Call init() when we open the window
function init() {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({url: url_carto_cdn})
            })
        ],
        view: myview
    })

    // The following is to create three different layers. openStreetMapStandard, openStreetMapHumanitarian and stamenTerrain
    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(), // open street map
        visible: true,
        title: 'OSMStandard'
    })

    map.addLayer(openStreetMapStandard);

    // Vector Layers
    var styles = [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: [125, 45, 45, 0.15]
            }),
            stroke: new ol.style.Stroke({
                color: 'red', // '#3399CC'
                width: 1.2
            }),

            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: "blue"
                }),
                radius: 3.5,
                stroke: new ol.style.Stroke({
                    color: 'red', // '#3399CC'
                    width: 1.2
                }),

            }),

        })
    ];

    // Manually created geojson of italy by http://geojson.io/#map=7/51.529/-0.110
    var ItalyGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: './data/vector_data/italyFix.geojson'
        }),
        visible: true,
        title: 'ITALY',
        style: styles
    })
    map.addLayer(ItalyGeoJSON);

    // Vector feature popup
    const overlayContainerElement = document.querySelector(".overlay-container");
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    })
    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureAdditionalINFO = document.getElementById('feature-additional-info');

    map.on('click', function (i) { // create a click event ;
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(i.pixel, function (feature, layer) {
                let clickedCoordinate = i.coordinate;
                let lonLatCoordinate = ol.proj.toLonLat(clickedCoordinate) // longitude as 1st and latitude as 2nd element
                let clickedFeatureName = feature.get('NAME');
                let clickedFeatureAdditionalINFO = feature.get('additionalinfo');
                overlayLayer.setPosition(clickedCoordinate);
                overlayFeatureName.innerHTML = clickedFeatureName;
                overlayFeatureAdditionalINFO.innerHTML = clickedFeatureAdditionalINFO;
            },
            {
                layerFilter: function (layerCandidate) { // it's a filter that select the geojson you want to use
                    return layerCandidate.get("title") === 'ITALY'
                }
            })
    })


    // Create a click event to call getMapCoordOnClick()
    map.on("click", (e) => getMapCoordOnClick(e));
}


/**
 * Get the weather info when click on the map
 * @param evt click event
 */
const getMapCoordOnClick = (evt) => 
{
    console.log("getMapCoordOnClick invoked");
    //tuple of coordinates
    const lonLat = ol.proj.toLonLat(evt.coordinate);
    //prepare clean ambient
    cleanCurrentCity();

    currentCity.longitude = lonLat[0];
    currentCity.latitude = lonLat[1];
    console.log(currentCity);

    // Also only represent the city name on the console, can't print it and call it now; It's the problem of async and cannot get the OBJECT correctly
    getCityByCoordinates();
}

/**
 * Function for zoom in the map to the specific city
 */
function zoomIn(Lat , Lon)
{
    myview.animate({
        center: [Lat , Lon],
        duration: 1800,
        zoom: 6
    })
}

class city
{
    constructor(cityC, cityN, lat, lon)
    {
        this.cityCode = cityC;
        this.cityName = cityN;
        this.latitude = lat;  // [-90.0 ; 90.0]
        this.longitude = lon; // [-180.0 ; 180.0]
    }
}
var currentCity = new city();
var currentCityForecast = []; //array of forecast of 12 hours

function cleanCurrentCity()
{
    currentCity.cityCode = 0;
    currentCity.cityName = null;
    currentCity.longitude = 0;
    currentCity.latitude = 0;
}