/* Vienna Sightseeing Beispiel */

//Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
}

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup(),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup(),
  zones: L.featureGroup().addTo(map),
  hotels: L.featureGroup(),

}
// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "NASAGIBS Earth at night": L.tileLayer.provider("NASAGIBS.ViirsEarthAtNight2012"),
    "ÖPNV Österreich": L.tileLayer.provider("OPNVKarte"),
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
    "Vienna Sightseeing Linien": themaLayer.lines,
    "Vienna Sightseeing Stops": themaLayer.stops,
    "Fußgängerzonen": themaLayer.zones,
    "Hotels und Unterkünfte": themaLayer.hotels,

  })
  .addTo(map);

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

//Vollbild
L.control
  .fullscreen()
  .addTo(map);

async function loadSights(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      // console.log(feature);
      // console.log(feature.properties.NAME);
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}"
        target="wien">${feature.properties.NAME}</a></h4>
        <address>${feature.properties.ADRESSE}</address>
        `);
    }
  }).addTo(themaLayer.sights);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")

/*
Suche "sightseeing"

loadLines
Touristische Kraftfahrlinien Liniennetz Vienna Sightseeing Linie Wien 
lines 

loadStops
Touristische Kraftfahrlinien Haltestellen Vienna Sightseeing Linie Standorte Wien 
stops

Suche "Fußgängerzone"
loadZones
Fußgängerzonen Wien 
zones

Suche "Hotels"
loadHotels
Hotels und Unterkünfte Standorte Wien 
hotels
*/

async function loadLines(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    style: function (feature) {
      console.log("XXXX", feature.properties.LINE_NAME);
      let lineName = feature.properties.LINE_NAME;
      let lineColor = "black";
      if (lineName == "Red Line") {
        lineColor = "#FF4136";
      } else if (lineName == "Yellow Line") {
        lineColor = "#FFDC00";
      } else if (lineName == "Blue Line") {
        lineColor = "#0074D9";
      } else if (lineName == "Green Line") {
        lineColor = "#2ECC40 ";
      } else if (lineName == "Grey Line") {
        lineColor = "#AAAAAA";
      } else if (lineName == "Orange Line") {
        lineColor = "#FF851B";

      } return {
        color: lineColor,
      };
    },
    onEachFeature: function (feature, layer) {
      //console.log(feature);
      //console.log(feature.properties.NAME);
      layer.bindPopup(`
    
     <p> <i class="fa-solid fa-bus"></i>
      <strong>${feature.properties.LINE_NAME}</strong> </p>
      
      <i class="fa-solid fa-circle-stop"></i> 
      ${feature.properties.FROM_NAME} <br>
      <i class="fa-solid fa-down-long"></i> <br>
      <i class="fa-solid fa-circle-stop"></i>
      ${feature.properties.TO_NAME}
        `);
    }
  }).addTo(themaLayer.lines);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

async function loadStops(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      //console.log(feature);
      //console.log(feature.properties.NAME);
      layer.bindPopup(`
      <p> <i class="fa-solid fa-bus"></i>
      <strong>${feature.properties.LINE_NAME}</strong> </p>
      ${feature.properties.STAT_ID}
      ${feature.properties.STAT_NAME}
        `);
    }
  }).addTo(themaLayer.stops);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

async function loadZones(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    style: function (feature) {
      return {
        color: "#F012BE",
        weight: 1,
        opacity: 0.4,
        fillOpacity: 0.1,
      };
    },
    onEachFeature: function (feature, layer) {
      // console.log(feature);
      // console.log(feature.properties.NAME);
      layer.bindPopup(`
      <p><strong>Fußgängerzone ${feature.properties.ADRESSE} </strong></p>
      <i class="fa-regular fa-clock"></i>
      ${feature.properties.ZEITRAUM || "dauerhaft"}
      <p><i class="fa-solid fa-circle-info"></i> 
      ${feature.properties.AUSN_TEXT || "ohne Ausnahmen"}
      </p>
        `);
    }
  }).addTo(themaLayer.zones);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");


async function loadHotels(url) {
  // console.log("Loading", url);
  let response = await fetch(url)
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      // console.log(feature);
      // console.log(feature.properties.NAME);
      layer.bindPopup(`
<h3>${feature.properties.BETRIEB} </h3>
<h3><p>${feature.properties.BETRIEBSART_TXT} ${feature.properties.KATEGORIE_TXT}</p></h3>
<hr>
<p>Addr.: ${feature.properties.ADRESSE} <br>
<a href="tel:${feature.properties.KONTAKT_TEL}">Tel.: ${feature.properties.KONTAKT_TEL}</a> <br>
<a href="mailto:${feature.properties.KONTAKT_EMAIL}">${feature.properties.KONTAKT_EMAIL}</a> <br>
<a href="${feature.properties.WEBLINK1}"target="hotel">Homepage</a>
</p>
        `);
    }
  }).addTo(themaLayer.hotels);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");


