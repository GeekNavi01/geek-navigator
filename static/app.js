// const findMe = () => {
//     const status = document.querySelector('.message');

//     const success = (position) => {
//         api_key = ",,,,,,,";
//         const lat = position.coords.latitude;
//         const long = position.coords.longitude;

//         const geoUrl = `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${long}&localityLanguage=en&key=${api_key}`;

//         fetch(geoUrl)
//         .then(response => response.json())
//         .then(data => {
//             status.textContent = `Found you in: ${data.locality}, ${data.city}, ${data.countryName}`;
//         });
//     }

//     const error = () => {
//         status.textContent = "Couldn't find your location. Please allow location access.";
//     }

//     navigator.geolocation.getCurrentPosition(success, error);
// }

// document.querySelector('.button').addEventListener('click', findMe);

// //map
// function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//       center: {lat: -29.8579, lng: 31.0292},
//       zoom: 18
//     });
//     var input = document.getElementById('searchInput');
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//     var autocomplete = new google.maps.places.Autocomplete(input);
//     autocomplete.bindTo('bounds', map);

//     var infowindow = new google.maps.InfoWindow();
//     var marker = new google.maps.Marker({
//         map: map,
//         anchorPoint: new google.maps.Point(0, -29)
//     });

//     autocomplete.addListener('place_changed', function() {
//         infowindow.close();
//         marker.setVisible(false);
//         var place = autocomplete.getPlace();
//         if (!place.geometry) {
//             window.alert("Autocomplete's returned place contains no geometry");
//             return;
//         }
  
//         // If the place has a geometry, then present it on a map.
//         if (place.geometry.viewport) {
//             map.fitBounds(place.geometry.viewport);
//         } else {
//             map.setCenter(place.geometry.location);
//             map.setZoom(17);
//         }
//         marker.setIcon(({
//             url: place.icon,
//             size: new google.maps.Size(71, 71),
//             origin: new google.maps.Point(0, 0),
//             anchor: new google.maps.Point(17, 34),
//             scaledSize: new google.maps.Size(35, 35)
//         }));
//         marker.setPosition(place.geometry.location);
//         marker.setVisible(true);
    
//         var address = '';
//         if (place.address_components) {
//             address = [
//               (place.address_components[0] && place.address_components[0].short_name || ''),
//               (place.address_components[1] && place.address_components[1].short_name || ''),
//               (place.address_components[2] && place.address_components[2].short_name || '')
//             ].join(' ');
//         }
    
//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//         infowindow.open(map, marker);
      
//         // Location details
//         for (var i = 0; i < place.address_components.length; i++) {
//             if(place.address_components[i].types[0] == 'postal_code'){
//                 document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
//             }
//             if(place.address_components[i].types[0] == 'country'){
//                 document.getElementById('country').innerHTML = place.address_components[i].long_name;
//             }
//         }
//         document.getElementById('location').innerHTML = place.formatted_address;
//         document.getElementById('lat').innerHTML = place.geometry.location.lat();
//         document.getElementById('lon').innerHTML = place.geometry.location.lng();
//     });
// }

//set map options

//set map options

var myLatLng = {
    lat: -29.8579, 
    lng: 31.0292
}

var mapOptions = {
    center: myLatLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
}

//create map

var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions)

//create directions service object to use the route method and get results for our search 

var directionService = new google.maps.DirectionsService();

//create DirectionsRender to display routes

var directionsRender = new google.maps.DirectionsRenderer();

//bind directionsRender to the map

directionsRender.setMap(map);

//function

function calcRoute(){
    //create a request

    var request = {
        origin: document.getElementById('from').value,
        destination: document.getElementById('to').value,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass request to the route method

    directionService.route(request, (result, status) => {
        if(status == google.maps.DirectionsStatus.OK){
            //get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = '<div class="alert-info">From: ' + document.getElementById('from').value + 
            '.<br />To: ' + document.getElementById('to').value + 
            '.<br />Driving distance <i class="fas fa-road"></i>: ' + result.routes[0].legs[0].distance.text +
            '.<br />Duration <i class="fas fa-hourglass-start"></i>: ' + result.routes[0].legs[0].duration.text +
            '.</div>';

            //display route
            directionsRender.setDirections(result);
        }else{
            //delete route from map
            directionsRender.setDirections({routes: []});

            //center map
            map.setCenter(myLatLng);

            //show error message if any
            output.innerHTML = '<div class="alert-danger"><i class="fas fa-exclamation-triangle"></i> Could not calculate distance! </div>';

        }
    });
}

//create autocomplete object

var options = {
    types: ['(cities)']
}

var input = document.getElementById('from');
var autocomplete1 = new google.maps.places.Autocomplete(input, options);
var input2 = document.getElementById('to');
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);