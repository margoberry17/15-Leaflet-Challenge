// Load the EarthquakeJSON data.
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the geoJSON data with d3.
d3.json(earthquakeURL).then(function (data) {
    console.log(data);
    createFeatures(data.features);
});

// Function to determine marker size
function markerSize(magnitude) {
    return magnitude * 2000;
};

// Function to determine marker color by depth
function markerColor(depth){
    if (depth < 10) return "purple";
    else if (depth < 30) return "blue";
    else if (depth < 50) return "green";
    else if (depth < 70) return "yellow";
    else if (depth < 90) return "orange";
    else return "red";
}

function createFeatures(earthquakeData) {
    // Function to disply the info when the feature is clicked
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place 
        + "</h3><h2>Date: " + new Date(feature.properties.time) 
        + "</h2><h2>Magnitude: " + feature.properties.mag 
        + "</h2><h2>Depth: " + feature.geometry.coordinates[2] + "</h2>");
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
        var markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.5,
            color: "black",
            weight: 0.5
        }
        return L.circle(latlng,markers);
        }
    });
    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create tile layer
    var geoLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create our map, giving it the geoLayer map and earthquakes layers to display on load.
     var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 2,
        layers: [geoLayer, earthquakes]
    });

    // Add legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap)
};

