// Get the modal
var m = document.getElementById("instuction");

// Get the button that opens the modal
var b = document.getElementById("B");

// Get the <span> element that closes the modal
var s = document.getElementsByClassName("c")[0];

// When the user clicks on the button, open the modal
b.onclick = function() {
  m.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
s.onclick = function() {
  m.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == m) {
    m.style.display = "none";
  }
}