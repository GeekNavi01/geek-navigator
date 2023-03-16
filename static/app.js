//get user current location
const findMe = () => {
    const statuss = document.querySelector('.message');

    const success = (position) => {
        api_key = "bdc_1783bb7faf69450ab43135fc4ec344f1";
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        const geoUrl = `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${long}&localityLanguage=en&key=${api_key}`;

        fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            statuss.innerHTML = `<span><i class="fa-solid fa-location-dot"></i></span> ${data.locality}, ${data.city}, ${data.countryName}`;
        });
    }

    const error = () => {
        statuss.textContent = "Couldn't find your location. Please allow location access.";
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

document.querySelector('.button-btn').addEventListener('click', findMe);

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

//travek mode
function displayRoute(){
    const selectMode = document.getElementById('mode').value;

    var request = {
        origin: document.getElementById('from').value,
        destination: document.getElementById('to').value,
        travelMode: google.maps.TravelMode[selectMode],
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

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

document.getElementById('mode').addEventListener('change', () => {
    displayRoute(directionService, directionsRender);
})

//create autocomplete object

var options = {
    types: ['(cities)']
}

var input = document.getElementById('from');
var autocomplete1 = new google.maps.places.Autocomplete(input, options);
var input2 = document.getElementById('to');
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);