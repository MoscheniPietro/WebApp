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

var observatedBirdsArray = [];  //array containing all BirdsData from JSON
var observatedBirdsNamesArray = []; //array containing all birds names from json
var selectedBird;

/**
 * Function parses json a saves info into array
 * @param allBirds
 */

//ETC finire di compilare tutti i campi come da struttura sopra
function saveBirdsObservation(allBirds)
{
    //pulizia strutture
    observatedBirdsArray.clear();
    observatedBirdsNamesArray.clear();

    allBirds.forEach((obsBird) =>
    {
        let singleBirdObs = new birdsData();
        singleBirdObs.speciesCode = obsBird.speciesCode;
        singleBirdObs.commonName = obsBird.commonName;
        singleBirdObs.scientificName = obsBird.scientificName;
        singleBirdObs.locationId = obsBird.locationId;
        singleBirdObs.locationName = obsBird.locationName;
        singleBirdObs.observationDt = obsBird.observationDt;
        singleBirdObs.howMany = obsBird.howMany;
        singleBirdObs.latitude = obsBird.latitude;
        singleBirdObs.longitude = obsBird.longitude;
        singleBirdObs.observatinReviewed = obsBird.observatinReviewed;
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

function loadFoundBirds()
{
    //TODO in questa funzione bisogna caricare tuitti i nomi in observatedBirdsNamesArray nella combobox per la selezione
}

/**
 *
 */
function getSelectedBirdData()
{
    var currentSelectedBirdObservation;

    //TODO fare ricerca in observatedBirdsArray dell'elemento selezionato nella combobox (che avrai salvato in selectedBird)
    // con observatedBirdsArray[selectedBird] o qualcosa del genere
    //alla fine avrai currentSelectedBirdObservation = observatedBirdsArray[selectedBird] non è così, ma il concetto è questo

    return currentSelectedBirdObservation;
}

/**
 * this function updates GUI with obs birds
 */
function updateGUI()
{
    let electedBird = getSelectedBirdData();
    console.log(selectedBird);

    //TODO aggiungere le variabili corrette

    //updating details into HTML
    textContent.innerHTML = `
    <h2 class="font-c">${electedBird.cityName.toUpperCase()}</h2>
    <h4 class="font-c">${"Lat: " + electedBird.latitude.toFixed(6)} </h4>
    <h4 class="font-c">${"Lon: " + electedBird.longitude.toFixed(6)} </h4>
    <h3 class="font-c">${electedBird.iconPhrase}</h3>    
    <h4 class="font-c">${"Temperature: " + electedBird.temperatureValue.toFixed(decimals)} &degC</h4>
    <h4 class="font-c">${"Humidity: " + electedBird.relativeHumidity.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Wind Speed: " + electedBird.windSpeed.toFixed(decimals) + " km/h"}</h4>
    <h4 class="font-c">${"Cloud Cover: " + electedBird.cloudCover.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Rain Probability: " + electedBird.rainProbability.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Rain: " + electedBird.rainValue.toFixed(decimals) + " mm"}</h4>
    <h4 class="font-c">${"Snow Probability: " + electedBird.snowProbability.toFixed(decimals)} &percnt;</h4>
    <h4 class="font-c">${"Snow: " + electedBird.snowValue.toFixed(decimals) + " mm"} </h4>
    `;
    
}

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