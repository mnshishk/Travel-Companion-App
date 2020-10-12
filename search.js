// function initMap(){
// 	var map = new google.maps.Map(document.getElementById("map"), {
// 		zoom: 15,
// 		center: {lat:42.880230,lng:-78.878738}
// 		// mapTypeControl: false,
// 		// fullscreenControl: false,
// 		// zoomControl: false
// 	});
// 	const geocoder = new google.maps.Geocoder();
// 	document.getElementById("submit").addEventListener("click", () => {
// 	  geocodeAddress(geocoder, map);
// 	});
	

// }

// function geocodeAddress(geocoder, resultsMap) {
// 	const address = document.getElementById("address").value;
// 	geocoder.geocode({ address: address }, (results, status) => {
// 	  if (status === "OK") {
// 		resultsMap.setCenter(results[0].geometry.location);
// 		resultsMap.setZoom(15);
// 		new google.maps.Marker({
// 		  map: resultsMap,
// 		  position: results[0].geometry.location,
// 		});
// 	  } else {
// 		alert("Geocode was not successful for the following reason: " + status);
// 	  }
// 	});
//   }