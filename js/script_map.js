// Google Map-API:
// Define the map, service, and infowindow globally
let map;
let service;
let infowindow;
let markers = []


// Initialize the map when the API script loads
    function initMap() {
      var location = new google.maps.LatLng(37.335480, -121.893028);
      

    // Create a new map centered at the specified location
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15,
        mapId: "DEMO_MAP_ID"
    });

    // Initialize the Places service with the map
    service = new google.maps.places.PlacesService(map);

    // Add event listener for the search button
    document.getElementById('searchButton').addEventListener('click', () => {
        const placeType = document.getElementById('places').value;
        console.log("Searching for type: ", placeType);
        searchNearby(location, placeType);
    });


   // Create a request to search for nearby schools
   function searchNearby(location, placeType) {
      clearMarkers();
   // Ensure the location is correctly specified as a LatLng object
   const loc = new google.maps.LatLng(location); // Example location

   const request = {
       location: loc,
       radius: '10000', // Radius in meters
       type: [placeType] // Search for schools
   };

   // Perform the search for nearby schools
      service.nearbySearch(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
         createMarker(results[i]);
      }
      } else {
      console.error('PlacesService failed: ' + status);
      }
   });
   }
   }

   // Function to create markers for the search results
   async function createMarker(place) {
   const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

   const marker = new AdvancedMarkerElement({
      //const marker = new google.maps.Marker({
      map,
      position: place.geometry.location
   });
   markers.push(marker)

   // Add an info window with the place name
   var infoWindow = new google.maps.InfoWindow({
       content: place.name
   });

   // Display the info window when the marker is clicked
   marker.addListener('click', function() {
       infoWindow.open(map, marker);
   });
   }

function clearMarkers() {
   for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
  }
   markers = []
}

// The initMap function is globally accessible
window.initMap = initMap;





