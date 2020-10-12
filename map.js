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
            map.setCenter(latLng);
            geocoder.geocode({ location: latLng }, (results, status) => {
			    if (status === "OK") {
			      if (results[0]) {
			        map.setZoom(11);
			        map.setCenter(latLng);
            		var marker = setMarker(latLng, map, "You are here");
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
		resultsMap.setCenter(results[0].geometry.location);
		resultsMap.setZoom(15);
		new google.maps.Marker({
		  map: resultsMap,
		  position: results[0].geometry.location,
		});
	  } else {
		alert("Geocode was not successful for the following reason: " + status);
	  }
	});
}


function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService.route(
    {
      origin: {
        query: document.getElementById("start").value,
      },
      destination: {
        query: document.getElementById("end").value,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

function initMap(){
	var map;
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
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	getUserLoc(geocoder,map)

	directionsRenderer.setMap(map);

	document.getElementById("submit").addEventListener("click", () => {
	  geocodeAddress(geocoder, map);
	});

	const onChangeHandler = function () {
		calculateAndDisplayRoute(directionsService, directionsRenderer);
	};
	document.getElementById("start").addEventListener("change", onChangeHandler);
	document.getElementById("end").addEventListener("change", onChangeHandler);
}

