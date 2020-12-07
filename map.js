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
var darkTheme;
var dark =0;
var rangeVar = 3600;
var directionsService;
var directionsRenderer;
var trafficLayer;
const waypts = [];

lightTheme = {
		styles: []};

 darkTheme = {
	styles: [
	{ elementType: "geometry", stylers: [{ color: "#242f3e" }] },
	{ elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
	{ elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
	{
		featureType: "administrative.locality",
		elementType: "labels.text.fill",
		stylers: [{ color: "#d59563" }],
	},
	{
		featureType: "poi",
		elementType: "labels.text.fill",
		stylers: [{ color: "#d59563" }],
	},
	{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [{ color: "#263c3f" }],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.fill",
		stylers: [{ color: "#6b9a76" }],
	},
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [{ color: "#38414e" }],
	},
	{
		featureType: "road",
		elementType: "geometry.stroke",
		stylers: [{ color: "#212a37" }],
	},
	{
		featureType: "road",
		elementType: "labels.text.fill",
		stylers: [{ color: "#9ca5b3" }],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [{ color: "#746855" }],
	},
	{
		featureType: "road.highway",
		elementType: "geometry.stroke",
		stylers: [{ color: "#1f2835" }],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.fill",
		stylers: [{ color: "#f3d19c" }],
	},
	{
		featureType: "transit",
		elementType: "geometry",
		stylers: [{ color: "#2f3948" }],
	},
	{
		featureType: "transit.station",
		elementType: "labels.text.fill",
		stylers: [{ color: "#d59563" }],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [{ color: "#17263c" }],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [{ color: "#515c6d" }],
	},
	{
		featureType: "water",
		elementType: "labels.text.stroke",
		stylers: [{ color: "#17263c" }],
	},
],};

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
    }
  );
}

function searchFood(){
	const service = new google.maps.places.PlacesService(map);

	service.nearbySearch(
	{ location: globalOrigin, radius: 3000, types:[ "restaurant", "cafe"] },
	(results, status, pagination) => {
	  if (status !== "OK"){
		return;
	  }
	  createMarkers(results, map);
	  setMapOnAll(map);
	}
	);
}

function changeRange(){
	var promptVar = prompt("Please enter your search range in miles.", "0");
	if (promptVar != null) {
		rangeVar = parseInt(promptVar) * 1609;
 	}
}

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
}

function removeFromResults(){
	var result = document.getElementById('places');
	result.remove();
}

function addToSchedule(placeLoc, placeName){
	var schedule = document.getElementById("schedule");
	var mainElement = document.createElement("div");
	var element = document.createElement("button");
	element.setAttribute("class", "schedBtn");
	var remove = document.createElement("button")
	remove.innerHTML = "X";
	remove.title = "Remove"
	remove.setAttribute("class", "schedRem");
	var geocoder = new google.maps.Geocoder()

	geocoder.geocode({ location: placeLoc }, (results, status) => {
		if (status === "OK") {
		    if (results[0]) {
		    	element.innerHTML = "Route to: " + String(placeName + ", " + results[0].formatted_address)
		    	element.title = "Route to: " + String(placeName + ", " + results[0].formatted_address)
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

function clearRoute(){
	directionsRenderer.set('directions', null);
}

function reset(){
	initMap();
}

function darkMode(){
	const chk = document.getElementById('dm_button');
	var panel_l = document.querySelector(".left-panel");
	var panel_r = document.querySelector(".right-panel");
	var menu = document.getElementById("menu_title");
	var search = document.querySelector(".search");
	var mode_panel = document.getElementById("mode-panel");
	var menu_btn = document.getElementById("menu");
	var sched_close = document.querySelector(".close");
	var sched = document.querySelector(".modal-content");
	var sched_btn = document.querySelector(".schedBtn");
	var sched_rem = document.querySelector(".schedRem");

	chk.addEventListener('change', () => {
		if(chk.checked && panel_l.className == "left-panel"){
			document.body.classList.toggle("dark");
			panel_l.classList.toggle("left-panel-dark");
			panel_r.classList.toggle("right-panel-dark");
			search.classList.toggle("search-dark");
			sched_close.classList.toggle("close-dark");
			sched.classList.toggle("modal-content-dark");
			menu.id = "menu_title_d";
			mode_panel.id = "mode-panel-dark";
			menu_btn.id = "menu-dark"
			// sched_btn.classList.toggle("schedBtn-dark")
			// sched_rem.classList.toggle("schedRem-dark")
			map.setOptions(darkTheme);
		} else{
			document.body.classList.remove("dark");
			panel_l.className = "left-panel";
			panel_r.className = "right-panel";
			search.className = "search";
			sched_close.className = "close";
			sched.className = "modal-content";
			// sched_btn.className = "schedBtn";
			// sched_rem.className = "schedRem";
			menu.id = "menu_title";
			mode_panel.id = "mode-panel";
			menu_btn.id = "menu";
			map.setOptions(lightTheme);
		}
	});
}
