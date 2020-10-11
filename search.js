

function search() {

    var address=document.getElementById("address").value
    var geocoder = new google.maps.Geocoder();

    if (status == google.maps.GeocoderStatus.OK) 
    {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map, 
            position: results[0].geometry.location
        });
    } 
    else 
    {
        alert("Geocode was not successful for the following reason: " + status);
    }
  }
