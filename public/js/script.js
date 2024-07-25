// Initilize Socket io
const socket = io();

// Check if the Browser supports Geolocation
if (navigator.geolocation) {
    // Watch User Current Position (fun(position),error,settings)
    navigator.geolocation.watchPosition(
        (position) => {
            //Fetch Coordinators from Position
            const { latitude, longitude } = position.coords;
            // Now Emit From Frontend to Backend
            socket.emit("send-location", { latitude, longitude });

        }, (error) => { // Error in Watching
            console.log(error);
        },
        //Settings for Watch Position
        {
            enableHighAccuracy: true, //High Accurecy
            maximumAge: 0, //No-Caching
            timeout: 5000 //Recheck Time(ms)
        }
    );

}

// Initilize Map using Leaflet
const map = L.map("map").setView([0, 0], 16); //Set Map view as([latitude, longitude],Zoom)

// Create Layer of My View & Add it to Map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Rohan Saha"
}).addTo(map);

// Create an Marker to Identify My Location
const markers = {};

// Fetch the receive-location from bakend
socket.on("receive-location", (data) => {
    
    // Fetch id,latitude,longitude from data
    const { id, latitude, longitude } = data;
    // Set my View as per my latitude & longitude Received from Backend
    map.setView([latitude, longitude]);

    // User already Created -> // Set its Latitude & Longitude (setLatLng)
    if (markers[data.id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    // Create new Marker
    else {
        markers[data.id] = L.marker([latitude, longitude]).addTo(map)
        // Show Currect Location Coordinations
        .bindPopup(
            "<h5> Your Location </h5>" +
            "Latitude: " +
            latitude +
            "<br> Longitude:  " +
            longitude +
            '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
            latitude +
            "," +
            longitude +
            '" target="_blank">Open in Google Maps</a>'
        );
    }
})


// If User Disconnects
socket.on("user-disconnected", (id) => {
    // User already Exists
    if (markers[id]) {
        map.removeLayer(markers[id]); //Remove from Map
        delete markers[id];//Delete from Boject
    }
})

// Search Function
document.getElementById('search-btn').addEventListener('click', function() {
    var latlng = document.querySelector('input').value;
    var latlngArr = latlng.split(',');
    var lat = latlngArr[0];
    var lng = latlngArr[1];
    map.setView([lat, lng], 16);
    L.marker([lat, lng]).addTo(map).bindPopup(
        "<h5> Your Location </h5>" +
        "Latitude: " +
        lat +
        "<br> Longitude:  " +
        lng +
        '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
        lat +
        "," +
        lng +
        '" target="_blank">Open in Google Maps</a>'
    );
});
