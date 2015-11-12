var myApp = angular.module('myApp', []);
myApp.controller('mapCtrl', function($scope) {

	// create map options for google map constructor
	var mapOption = {
		zoom: 4,
			// center of the united states
		center: new google.maps.LatLng(40.0000, -98.0000)
	}

	// create new map obj with markers array to hold markers
	$scope.map = new google.maps.Map(document.getElementById('map'), mapOption);
	$scope.markers = [];

	// create google maps info window
	var infoWindow = new google.maps.InfoWindow();

	// create markers for each city in the cities obj
	var createMarker = function(city, index) {
		console.log(city);
		console.log(index);
		console.log(typeof(latLon));

		// create an array obj from the latLon string
		var latLon = city.latLon.split(',');
		var lat = latLon[0];
		var lon = latLon[1];

		// convert lat lon array items into an objects
		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(lat, lon),
			title: city.city,
			icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569'
		});

		// create HTML for the info window div
	   markerContentHTML = '<div class="infoWindowContent">';
       markerContentHTML += '<div class="total-pop">Total Population: ' + city.yearEstimate + '</div>';
       markerContentHTML += '<div class="pop-dens-last-year">2010 Census: ' + city.lastCensus + '</div>';
       markerContentHTML += '<div class="pop-change">Population Change %: ' + city.change + '</div>';
       markerContentHTML += '<div class="pop-dens">Population Density: ' + city.lastPopDensity + '</div>';
       markerContentHTML += '<div class="state">State: ' + city.state + '</div>';
       markerContentHTML += '<div class="land-area">Land Area: ' + city.landArea + '</div>';
       markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+')">Get directions</a>';
       markerContentHTML += '</div>'; 

       // put html onto marker content property
       marker.content = markerContentHTML;

       // add onclick listener to the marker
       google.maps.event.addListener(marker,'click', function() {
       		infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
       		infoWindow.open($scope.map, marker);
       	});

       $scope.markers.push(marker);
	};

	// sync the click event on the button to the marker on the map
	$scope.triggerClick = function(i) {
		google.maps.event.trigger($scope.markers[i-1], 'click');
	}

	getDirections = function (lat, lon) {
		// 
		var directionsService = new google.maps.DirectionsService();
   		var directionsDisplay = new google.maps.DirectionsRenderer();
   		var map = new google.mpas.Map(document.getElementById('map'), {
   			zoom: 7,
   			mapTypeId: google.maps.MapTypeId.ROADMAP
   		});

   		// set the map for directions on the id given
   		directionsDisplay.setMap(map);
   		directionsService.setPanel(document.getElementById('map-panel'));

   		var request = {
           //Origin hardcoded to Atlanta. Require geocode current loc,
           //or give user input
          origin: 'Atlanta, GA', 
          destination:new google.maps.LatLng(lat,lon), 
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
	}

	// put the cities object array into the angular controller scope
	$scope.cities = cities;

	// create marker for each city object
    for(i=0;i<cities.length;i++){
        createMarker(cities[i],i)
    }
});