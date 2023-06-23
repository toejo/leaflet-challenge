let street = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let myMap = L.map("map", {
    center: [39.42, -120.56], 
    zoom: 5,
    layers: street
});

let baseMaps = {
    "Street": street
};

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(url).then((data) => {

    //To check if data loads properly
    console.log(data)

    let mapFeatures = data.features;

    let mapMarkers = [];

    for (let i = 0; i < mapFeatures.length; i++) {
        let feature = mapFeatures[i];
        let coord = feature.geometry.coordinates;
        let latlon = {lon: coord[0], lat: coord[1]};
        let depth = coord[2];
        let mag = feature.properties.mag;

        let markerSize = mag * 3;
        let markerColor = depthColor(depth);

        let circleMarker = L.circleMarker(latlon, {
            radius: markerSize,
            fillColor: markerColor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
        });

        circleMarker.bindTooltip(
            `Location : ${latlon.lat}, ${latlon.lon}<br>Magnitude: ${mag}<br>Depth: ${depth}`
        ).openTooltip();

        mapMarkers.push(circleMarker);
    };

    let mapLayer = L.layerGroup(mapMarkers);

    let overlayMaps = {
        Earthquakes: mapLayer,
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
    }).addTo(myMap);
});

let legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  let ledge = L.DomUtil.create("ledge", "legend");
  let colors = [
    "#00ff00",
    "#7fff00",
    "#ffff00",
    "#ff7f00",
    "#ff0000",
    "#8b0000",
  ];
  let labels = [
    "< 10 km",
    "< 30 km",
    "< 50 km",
    "< 70 km",
    "< 90 km",
    "90 > km",
  ];

  for (let i = 0; i < colors.length; i++) {
    ledge.innerHTML +=
      '<i style="background:' +
      colors[i] +
      '"></i> ' +
      labels[i] +
      "<br>";
  }
  return ledge;
};

legend.addTo(myMap);

function depthColor(depth) {
    if (depth < 10) {
      return "#00ff00"; 
    } else if (depth < 30) {
      return "#7fff00"; 
    } else if (depth < 50) {
      return "#ffff00";
    } else if (depth < 70) {
      return "#ff7f00"; 
    } else if (depth < 90) {
      return "#ff0000";
    } else {
      return "#8b0000"; 
    }
  };