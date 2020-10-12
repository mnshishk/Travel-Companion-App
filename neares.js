var map;
var infowindow;

var request;
var service;
var markers = [];

function findfood(){
  var request = {
    location: center,
    radius:10000,
    types: ['food','restaurant', 'cafe']
  };
  infoWindow = new google.maps.infoWindow();

  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, callback);

  google.maps.event.addListener(map, 'rightclick', function(event){
    map.setCenter(event.latLng)
    clearResults(markers)

    var request = {
    location: event.latLng,
    radius:10000,
    types: ['food','restaurant', 'cafe']
  };
  service.nearbySearch(request, callback);

  })
}

function callback(results, status){
  if(status == google.maps.places.PlacesService.OK){
    for (var i = 0; i < results.length; i++){
      createMarker(results[i]);
    }
  }
}

function creatMarker(place){
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map. this);
  });
  return marker;
}