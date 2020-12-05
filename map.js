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
var add;
var rangeVar = 3600;
var directionsService;
var directionsRenderer;
var trafficLayer;
const waypts = [];
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
					add=results[0].formatted_address;
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
function geocodeAddress(geocoder) {
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


function calculateAndDisplayRoute(directionsService, directionsRenderer, end) {

	 const checkboxArray = document.getElementById("waypoints");
	 const selectedMode = document.getElementById("mode").value;


	var request = {
	 origin: globalOrigin,
	 destination: end,
	 waypoints: waypts,
   	 optimizeWaypoints: true,
	 travelMode: google.maps.TravelMode[selectedMode]
	};

	directionsService.route(request, function(result, status) {
	 if (status == 'OK') {
		directionsRenderer.setDirections(result);
		const route = response.routes[0];
	 } else {
	 	alert("Route was not successful for the following reason: " + status);
	 }
	});

}

function initMap(){
//	var map;
	directionsService = new google.maps.DirectionsService();
	directionsRenderer = new google.maps.DirectionsRenderer();
    trafficLayer = new google.maps.TrafficLayer();
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
	calculateAndDisplayRoute(directionsService, directionsRenderer);
  	document.getElementById("mode").addEventListener("change", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });

	const onChangeHandler = function () {
		calculateAndDisplayRoute(directionsService, directionsRenderer, globalEnd);
	};
	document.getElementById("submit").addEventListener("click", onChangeHandler);
	document.getElementById("end").addEventListener("change", onChangeHandler);

	document.getElementById("Range").addEventListener("click", () => {
	 	changeRange();
	});
	document.getElementById("Hotels").addEventListener("click", () => {
	  searchLodging();
	});
	document.getElementById("Entertainment").addEventListener("click", () => {
	  searchEntertainment();
	});
	document.getElementById("Gas").addEventListener("click", () => {
		searchGas();
	});
	document.getElementById("Food").addEventListener("click", () => {
	  searchFood();
	});
	document.getElementById("Delete").addEventListener("click", () => {
		deleteMarkers();
	});

}

function searchLodging(){
	const service = new google.maps.places.PlacesService(map);
	const pyrmont = { lat: 42.8864, lng: -78.8784};
  service.nearbySearch(
    { location: globalOrigin, radius: rangeVar, type: "lodgings" },
    (results, status, pagination) => {
      if (status !== "OK"){
				return;
			}
      createMarkers(results, map);
			setMapOnAll(map);
      // moreButton.disabled = !pagination.hasNextPage;
			//
      // if (pagination.hasNextPage) {
      //   getNextPage = pagination.nextPage;
      // }
    }
  );
}

function searchEntertainment(){
	const service = new google.maps.places.PlacesService(map);
	const pyrmont = { lat: 42.8864, lng: -78.8784};
  service.nearbySearch(
    { location: globalOrigin, radius: rangeVar, type: "bar" },
    (results, status, pagination) => {
      if (status !== "OK"){
			return;
		}
      createMarkers(results, map);
			setMapOnAll(map);
      // moreButton.disabled = !pagination.hasNextPage;
			//
      // if (pagination.hasNextPage) {
      //   getNextPage = pagination.nextPage;
      // }
    }
  );
}

function searchGas(){
	const service = new google.maps.places.PlacesService(map);
	const pyrmont = { lat: 42.8864, lng: -78.8784};

  service.nearbySearch(
    { location: globalOrigin, radius: rangeVar, type: "gas_station" },
    (results, status, pagination) => {
      if (status !== "OK"){
			return;
		}
      createMarkers(results, map);
	  setMapOnAll(map);
      // moreButton.disabled = !pagination.hasNextPage;
			//
      // if (pagination.hasNextPage) {
      //   getNextPage = pagination.nextPage;
      // }
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
	  setMapOnAll(map);
      // moreButton.disabled = !pagination.hasNextPage;
			//
      // if (pagination.hasNextPage) {
      //   getNextPage = pagination.nextPage;
      // }
    }
  );
}

function changeRange(){
	var promptVar = prompt("Please enter your range 0-5000", "0");
	if (promptVar != null) {
		rangeVar = parseInt(promptVar);
 }
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

		addMarker(place.geometry.location,image,place.name)
   	// marker.addListener("click", () => {
   	// 	addToSchedule(place.geometry.location, place.name);
   	// 	alert("Added the place to the schedule!")
   	// })
    // const li = document.createElement("li");
    // li.textContent = place.name;
		// li.setAttribute("class", "Result element");
    // placesList.appendChild(li);
    bounds.extend(place.geometry.location);

  }
  map.fitBounds(bounds);
}

function addMarker(location,image,name) {
     var marker = new google.maps.Marker({
       map,
      icon: image,
      title: name,
       position: location,
     });
		marker.addListener("click", () => {
   		addToSchedule(location, name);
   		alert("Added the place to the schedule!")
   	})
  markers.push(marker);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function deleteMarkers() {
	setMapOnAll(null);
    markers = [];
//	removeFromResults();
}

function removeFromResults(){
	var result = document.getElementById('places');
	// for(var i=0; i < result.length; i++){
	// 	console.log(result[i]);
	// 	result[i].parentNode.removeChild(result[i]);
	// }
	result.remove();
}
function addToSchedule(placeLoc, placeName){
	var schedule = document.getElementById("schedule");
	var mainElement = document.createElement("div");
	var element = document.createElement("button");
	element.setAttribute("class", "schedBtn");
	var remove = document.createElement("button")
	remove.innerHTML = "X";
	remove.title = "remove"
	var geocoder = new google.maps.Geocoder()

	geocoder.geocode({ location: placeLoc }, (results, status) => {
		if (status === "OK") {
		    if (results[0]) {
		    	element.innerHTML = "Route to: " + String(placeName + ", " + results[0].formatted_address)
				element.addEventListener("click", () => {
					calculateAndDisplayRoute(directionsService, directionsRenderer, placeLoc);
				})
		      } else {
		        window.alert("No results found");
		      }
		    } else {
		      window.alert("Geocoder failed due to: " + status);
		    }
	});

	mainElement.appendChild(element);
	mainElement.appendChild(remove);
	schedule.appendChild(mainElement);

	remove.addEventListener("click", () => {
		mainElement.remove();
		directionsRenderer.set('directions', null);
	})
}
function traffic(){
	var t = document.getElementById("traffic");
	t.addEventListener('change', function () {
		if (t.checked) {
		  trafficLayer.setMap(map);
		} else {

		  trafficLayer.setMap(null);
		}
	  });
}
function removeTraffic(){
	trafficLayer.setMap(null);
}

function waypointDisplay() {
  var x = document.getElementById("Bottom-panel");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function waypointIN(){
	waypts.push({
		 location: document.getElementById("waypoints").value,
		 stopover: true,
	 });

}




function reset(){
	initMap();
}
