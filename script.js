const APIKey="qla3hf2acmq";
let debug=1;

class birdsData
{
    constructor(spCode, comName, sciName, locId, locName, obsDt, hMany, lat, lng, obsValid, obsReviewed,locPrivate, sId)
    {
        this.speciesCode = spCode;
        this.commonName = comName;
        this.scientificName = sciName;
        this.locationId = locId;
        this.locationName = locName;
        this.observationDt = obsDt;
        this.howMany = hMany;
        this.latitude = lat;
        this.longitude = lng;
        this.observationValid = obsValid;
        this.observatinReviewed = obsReviewed;
        this.locationPrivate = locPrivate;
        this.subId = sId;
      }
}

/*const textContent = document.getElementById("content");
const search = document.getElementById("searchUser");
const weatherButton = document.getElementById("submit");*/

var observatedBirdsArray = [];  //array containing all BirdsData from JSON
var observatedBirdsNamesArray = []; //array containing all birds names from json
var selectedBirdName;

/**
 *
 */
function getHour() {
    var selectedBirdName;
  
    
    var selectElement = document.querySelector('#birdComboBox');
    selectedBirdName = selectElement.options[selectElement.selectedIndex].value;
  
    return selectedBirdName;
  }
  

/**
 * Function parses json a saves info into array
 * @param allBirds
 */

/**
 * Get data from JS
 * @param allBirds
 * Need to put ot the right side of the foreach the name of the field that you see on the console
 */
function saveBirdsObservation(allBirds)
{
    //pulizia strutture
    observatedBirdsArray.clear;
    observatedBirdsNamesArray.clear;

    allBirds.forEach((obsBird) =>
    {
        let singleBirdObs = new birdsData();
        singleBirdObs.speciesCode = obsBird.speciesCode;
        singleBirdObs.commonName = obsBird.comName;
        singleBirdObs.scientificName = obsBird.sciName;
        singleBirdObs.locationId = obsBird.locId;
        singleBirdObs.locationName = obsBird.locName;
        singleBirdObs.observationDt = obsBird.obsDt;
        singleBirdObs.howMany = obsBird.howMany;
        singleBirdObs.latitude = obsBird.lat;
        singleBirdObs.longitude = obsBird.lng;
        singleBirdObs.observationValid = obsBird.obsReviewed;
        singleBirdObs.observatinReviewed = obsBird.obsReviewed;
        singleBirdObs.locationPrivate = obsBird.locationPrivate;
        singleBirdObs.subId = obsBird.subId;

        observatedBirdsArray.push(singleBirdObs);
        observatedBirdsNamesArray.push(singleBirdObs.commonName);
    })

    if (debug === 1) console.log("Birds Names")
    if (debug === 1) console.log(observatedBirdsNamesArray);

    if (debug === 1) console.log("Saved Birds")
    if (debug === 1) console.log(observatedBirdsArray);
}

function loadFoundBirds() {
    
    var combobox = document.getElementById('birdComboBox');
    combobox.innerHTML = '';
  
    for (var i = 0; i < observatedBirdsNamesArray.length; i++) {
      var name = observatedBirdsNamesArray[i];
      var option = document.createElement('option');

      option.text = name;
      option.value = name;
  
      
      combobox.appendChild(option);
    }
  }
  

/**
 *
 */
function getSelectedBirdData() {
    var currentSelectedBirdObservation;

    var selectedBirdName = document.getElementById('birdComboBox');
    for (var i = 0; i < observatedBirdsArray.length; i++) {
      var observation = observatedBirdsArray[i];
  
      if (observation.name === selectedBirdName) {
        currentSelectedBirdObservation = observation;
        break;
      }
    }
  
    return currentSelectedBirdObservation;
  }
  

/**
 * this function updates GUI with obs birds
 */
/*function updateGUI()
{
    let selectedBird = getSelectedBirdData();
    console.log(selectedBirdName);

    //TODO aggiungere le variabili corrette

    //updating details into HTML
    textContent.innerHTML = `
    <h2 class="font-c">${selectedBird.speciesCode.toUpperCase()}</h2>
    <h4 class="font-c">${"Lat: " + selectedBird.commonName.toFixed(6)} </h4>
    <h4 class="font-c">${"Lon: " + selectedBird.scientificName.toFixed(6)} </h4>
    <h3 class="font-c">${selectedBird.locationId}</h3>    
    <h4 class="font-c">${"Temperature: " + selectedBird.locationName.toFixed(decimals)} &degC</h4>
    <h4 class="font-c">${"Humidity: " + selectedBird.observationDt.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Wind Speed: " + selectedBird.howMany.toFixed(decimals) + " km/h"}</h4>
    <h4 class="font-c">${"Cloud Cover: " + selectedBird.latitude.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Rain Probability: " + selectedBird.longitude.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Rain: " + selectedBird.observatinReviewed.toFixed(decimals) + " mm"}</h4>
    <h4 class="font-c">${"Snow Probability: " + selectedBird.locationPrivate.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Snow: " + selectedBird.subId.toFixed(decimals) + " mm"} </h4>
    `;
    
}*/

/**
 * Recent nearby observations
 * @returns {Promise<void>}
 */
async function getBirdsByCoordinates ()
{
    console.log("Avvio get dalle coordinate");

    //headers setup
    var myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", APIKey);


    const locationBaseUrl = "https://api.ebird.org/v2/data/obs/geo/recent?";
    const query = `lat=${currentCity.latitude.toFixed(2)}&lng=${currentCity.longitude.toFixed(2)}&key=${APIKey}`;
    if (debug === 1)console.log(query);
    if (debug === 1)console.log(locationBaseUrl + query);
    const res = await fetch(locationBaseUrl + query);
    const allBirds = await res.json()
    if (debug === 1) console.log(allBirds);
    const {LocalizedName, Key} = allBirds;

    //fill our city info
    currentCity.cityName = LocalizedName;
    currentCity.cityCode = Key;
    if (debug === 1) console.log(currentCity);
    saveBirdsObservation(allBirds);
}

/**
 * This function get the city key given the name, Milan
 * I can't optimize avoiding queries because a mm move of click can change the city
 * @returns {Promise<void>} populates the current city
 */

//AAA Vedere se farla funzionare o rimuoverla
async function getBirdsByCityName()
{
    const locationBaseUrl = "https://dataservice.accuweather.com/locations/v1/cities/search";
    const cityName = currentCity.cityName;

    const res = await fetch(locationBaseUrl + query);
    const tmpCity = await res.json()

    if(debug === 1)
    {
        console.log("City by name\n");
        console.log(tmpCity);
    }

    const {GeoPosition, Key} = tmpCity[0];
    //fill our city info
    currentCity.cityCode = Key;
    //unused in further development ATM
    currentCity.latitude = GeoPosition.Latitude;
    currentCity.longitude = GeoPosition.Longitude;
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

const centerCoordinates = ol.proj.fromLonLat([12.5674, 41.8719]); // Coordinate di Roma
const zoomLevel = 6;

window.onload = init(); // Call init() when we open the window
function init() {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: centerCoordinates,
            zoom: zoomLevel
        })
    });

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
    getBirdsByCoordinates().then(updateGUI);
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