
function initMap() {
	const directionsService = new google.maps.DirectionsService();
	const directionsRenderer = new google.maps.DirectionsRenderer();
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 8,
		center: {lat:42.880230,lng:-78.878738},
		mapTypeControl: false,
		fullscreenControl: false,
		zoomControl: false
	});
	directionsRenderer.setMap(map);
  
	const onChangeHandler = function () {
	  calculateAndDisplayRoute(directionsService, directionsRenderer);
	};
	document.getElementById("start").addEventListener("change", onChangeHandler);
	document.getElementById("end").addEventListener("change", onChangeHandler);
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