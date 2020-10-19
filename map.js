//Global variabvles that take in the position of the user and
//the geocode result of the search bar so that they can be used in calculateAndDisplayRoute funtion
var globalOrigin;
var globalEnd;
var places;
var infoWindow;
var markers = [];
var currentLoc;
var tempVar;
var map;
//create a marker for the map
function setMarker(pos, map){
	var marker = new google.maps.Marker({
		position: pos,
		map: map,
	});
	return marker;
}

// create an info window
function setInfoWin(){
	return new google.maps.InfoWindow();
}

// get the user location via HTML5 geoloc; Mike's part
function getUserLoc(geocoder, map){
	var infoWin = setInfoWin();
	if (navigator.geolocation) { //check if geolocation is available
        navigator.geolocation.getCurrentPosition(function(position){
        	// got the lattitude and longitude
        	var latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
					globalOrigin = new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
					tempVar = { lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
					  //map.setCenter(latLng);
            geocoder.geocode({ location: latLng }, (results, status) => {
			    if (status === "OK") {
			      if (results[0]) {
			        map.setZoom(11);
			        map.setCenter(latLng);
            		var marker = setMarker(latLng, map, "You are here");
								holder = marker;
			        infoWin.setContent(results[0].formatted_address);
			        infoWin.open(map, marker);
			      } else {
			        window.alert("No results found");
			      }
			    } else {
			      window.alert("Geocoder failed due to: " + status);
			    }
			  });
        },
        function(err){alert('ERROR(' + err.code + '): ' + err.message)},
        );
    }
	else{
		alert("geolocation is not supported by this browser :(");
	}
}

// Kevin's part
function geocodeAddress(geocoder, resultsMap) {
	const address = document.getElementById("address").value;
	geocoder.geocode({ address: address }, (results, status) => {
	  if (status === "OK") {
		//resultsMap.setCenter(results[0].geometry.location);
		//resultsMap.setZoom(15);
		globalEnd = results[0].geometry.location;
	  } else {
		alert("Geocode was not successful for the following reason: " + status);
	  }
	});
}


function calculateAndDisplayRoute(directionsService, directionsRenderer) {
 var start = document.getElementById('start').value;
 var end = document.getElementById('end').value;
 var request = {
	 origin: globalOrigin,
	 destination: globalEnd,
	 travelMode: 'DRIVING'
 };
 directionsService.route(request, function(result, status) {
	 if (status == 'OK') {
		 directionsRenderer.setDirections(result);
	 } else {
	 alert("Route was not successful for the following reason: " + status);
	 }
 });
}

function initMap(){
//	var map;
	const directionsService = new google.maps.DirectionsService();
	const directionsRenderer = new google.maps.DirectionsRenderer();

	// mapOptions control the overall appearance of the map
	var mapOptions = {
		zoom: 15,
		mapTypeControl: false,
		fullscreenControl: false,
		zoomControl: false
	}
	geocoder = new google.maps.Geocoder();
//	tempVar = new google.maps.Map(document.getElementById("map"), mapOptions);
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	getUserLoc(geocoder,map)

	directionsRenderer.setMap(map);

	document.getElementById("submit").addEventListener("click", () => {
	  geocodeAddress(geocoder, map);
	});

	const onChangeHandler = function () {
		calculateAndDisplayRoute(directionsService, directionsRenderer);
	};
	document.getElementById("submit").addEventListener("click", onChangeHandler);
	document.getElementById("end").addEventListener("change", onChangeHandler);
	//const service = new google.maps.places.PlacesService(map);
  let getNextPage;
  const moreButton = document.getElementById("more");
  moreButton.onclick = function () {
    moreButton.disabled = true;

    if (getNextPage) {
      getNextPage();
    }
  };

	document.getElementById("Hotels").addEventListener("click", () => {
	  searchLodging();
	});
	document.getElementById("Entertainment").addEventListener("click", () => {
	  searchEntertainment();
	});
	document.getElementById("Gas").addEventListener("click", () => {
		searchGas();
	  });
	document.getElementById("restaurants").addEventListener("click", () => {
		searchFood();
	});
}

function searchLodging(){
	const service = new google.maps.places.PlacesService(map);
	const pyrmont = { lat: 42.8864, lng: -78.8784};
  service.nearbySearch(
    { location: globalOrigin, radius: 3280, type: "lodgings" },
    (results, status, pagination) => {
      if (status !== "OK"){
				return;
			}
      createMarkers(results, map);
      moreButton.disabled = !pagination.hasNextPage;

      if (pagination.hasNextPage) {
        getNextPage = pagination.nextPage;
      }
    }
  );
}

function searchEntertainment(){
	const service = new google.maps.places.PlacesService(map);
	const pyrmont = { lat: 42.8864, lng: -78.8784};
  service.nearbySearch(
    { location: globalOrigin, radius: 3280, type: "bar" },
    (results, status, pagination) => {
      if (status !== "OK"){
				return;
			}
      createMarkers(results, map);
      moreButton.disabled = !pagination.hasNextPage;

      if (pagination.hasNextPage) {
        getNextPage = pagination.nextPage;
      }
    }
  );
}
function searchGas(){
	const service = new google.maps.places.PlacesService(map);
	const pyrmont = { lat: 42.8864, lng: -78.8784};
	
  service.nearbySearch(
    { location: globalOrigin, radius: 1000, type: "gas" },
    (results, status, pagination) => {
      if (status !== "OK"){
				return;
			}
      createMarkers(results, map);
      moreButton.disabled = !pagination.hasNextPage;

      if (pagination.hasNextPage) {
        getNextPage = pagination.nextPage;
      }
    }
  );
}
function searchFood(){
	const service = new google.maps.places.PlacesService(map);
	const pyrmont = { lat: 42.8864, lng: -78.8784};
	
  service.nearbySearch(
    { location: globalOrigin, radius: 3000, types:[ "restaurant", "cafe"] },
    (results, status, pagination) => {
      if (status !== "OK"){
				return;
			}
      createMarkers(results, map);
      moreButton.disabled = !pagination.hasNextPage;

      if (pagination.hasNextPage) {
        getNextPage = pagination.nextPage;
      }
    }
  );
}
// function searchLandmark(){
// console.log('shout');
// 	const service = new google.maps.places.PlacesService(map);
// 	const pyrmont = { lat: 42.8864, lng: -78.8784};
// 	console.log(tempVar);
//   service.nearbySearch(
//     { location: pyrmont, radius: 3280, type: "points_of_interest" },
//     (results, status, pagination) => {
// 			console.log('stug');
//       if (status !== "OK"){
// 				console.log(status);
// 				return;
// 			}
//       createMarkers(results, map);
//       moreButton.disabled = !pagination.hasNextPage;
//
//       if (pagination.hasNextPage) {
//         getNextPage = pagination.nextPage;
//       }
//     }
//   );
// 	console.log("landmark");
// }

function createMarkers(places, map) {
  const bounds = new google.maps.LatLngBounds();
  const placesList = document.getElementById("places");

  for (let i = 0, place; (place = places[i]); i++) {
    const image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };
    new google.maps.Marker({
      map,
      icon: image,
      title: place.name,
      position: place.geometry.location,
    });
    const li = document.createElement("li");
    li.textContent = place.name;
    placesList.appendChild(li);
    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}
