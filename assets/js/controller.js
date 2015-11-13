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
	$scope.hotels = [];

	// create google maps info window
	var infoWindow = new google.maps.InfoWindow();

	// create markers for the map
	var createMarker = function(position, title, icon) {

		var marker = new google.maps.Marker({
			map: $scope.map,
			position: position,
			title: title,
			icon: icon
		});

       // add onclick listener to the marker
       google.maps.event.addListener(marker,'click', function() {
       		infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
       		infoWindow.open($scope.map, marker);
       	});

       return marker;
	};

	// sync the click event on the button to the marker on the map
	$scope.triggerClick = function(i) {
		google.maps.event.trigger($scope.markers[i], 'click');
	}

	$scope.updateMarkers = function() {
		//for loop clears all markers when it runs.
		for(i=0;i < $scope.markers.length; i++) {
			$scope.markers[i].setMap(null);
		}
		// for loop sets markers on only cities included in filter search.
		for (var i = 0; i < $scope.filteredItems.length; i++) {
			createMarker($scope.filteredItems[i], i);
		};

	}

	$scope.lodgingSearch = function(latLon) {
		latLon = latLon.split(',');
		var lat = latLon[0];
		var lon = latLon[1];
		var position = new google.maps.LatLng(lat, lon)
		map = new google.maps.Map(document.getElementById('map'), {
			center: position,
			zoom: 11
		});

		infowindow = new google.maps.InfoWindow();

		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: position,
			radius: 5000000,
			types: ['lodging']
		}, function(results, status) {
			// apply the angular scope to the callback
			$scope.$apply(function() {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					// set hotels to the results of the call back
					$scope.hotels = results;
					// set the items array that we are looping through to hotels array 
					$scope.items = $scope.hotels;
					console.log(results);
					console.log($scope.hotels);
					for (var i = 0; i < results.length; i++) {
						createLodgingMarker(results[i]);
					}
				}
			})
		});
	}

	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createLodgingMarker(results[i]);
			}
		}
		return results;
  	}


  	function createLodgingMarker(place) {

  		var position = place.geometry.location;

  		createMarker(position, place.name, 'assets/images/hotel.png');

  		var marker = new google.maps.Marker({
  			map: map,
  			position: place.geometry.location,
  			icon: 'assets/images/hotel.png'
  		});

  		google.maps.event.addListener(marker, 'click', function() {
  			infowindow.setContent('<h2>'+place.name+'</h2>');
  			infowindow.open(map, this);
  		});
  	}

  	$scope.showLocation = function(location, title, icon) {
  		$scope.map = new google.maps.Map(document.getElementById('map'), {
			center: location,
			zoom: 13
		});

  		createMarker(location, title, icon);

  	}

  	$scope.findRestuarants = function(location, title, icon) {
  		$scope.showLocation(location, title, icon);

  		infowindow = new google.maps.InfoWindow();

		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: location,
			radius: 5000000,
			types: ['food']
		}, function callback(results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					createFoodMarker(results[i],location);
				}
				console.log(results);
			}
		});

	}

	function createFoodMarker(place, origin) {

  		var marker = createMarker(place.geometry.location, place.name, 'assets/images/food.png');

  		var markerContentHTML = '<div class="infoWindowContent">';
  		markerContentHTML += '<a href="#" onclick="getDirections('+ place.geometry.location +', '+ origin +')">Get directions</a>';
  		markerContentHTML += '</div>';

  		marker.content = markerContentHTML;

  		$scope.markers.push(marker);
  		console.log(origin);
  	}

	$scope.updateMarkers = function() {
		clearMarkers();

		for (var i = 0; i < $scope.filteredItems.length; i++) {
			createMarker($scope.filteredItems[i], i);
		};

		console.log($scope.filteredItems);
	}

	getDirections = function (lat, lon, placeOfOrigin) {
		// 
		var directionsService = new google.maps.DirectionsService();
   		var directionsDisplay = new google.maps.DirectionsRenderer();
   		var map = new google.maps.Map(document.getElementById('map'), {
   			zoom: 7,
   			mapTypeId: google.maps.MapTypeId.ROADMAP
   		});

   		// set the map for directions on the id given
   		directionsDisplay.setMap(map);
   		directionsDisplay.setPanel(document.getElementById('map-panel'));

   		var request = {
           //Origin hardcoded to Atlanta. Require geocode current loc,
           //or give user input
          origin: placeOfOrigin, 
          destination:new google.maps.LatLng(lat,lon), 
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
	}

	clearMarkers = function() {
		for(i=0;i < $scope.markers.length; i++) {
			$scope.markers[i].setMap(null);
		}
	}
	// Create city specific markers
	$scope.createCityMarkers = function() {
		// clear the current markers
		clearMarkers();
		$scope.map = new google.maps.Map(document.getElementById('map'), mapOption);

		// create marker for each city object
		for(i=0;i<cities.length;i++){

			// create the google lat lon object using their constructor

			// convert cities latLon into string coords
			var latLon = cities[i].latLon.split(',');
			var lat = latLon[0];
			var lon = latLon[1];
			
			var position = new google.maps.LatLng(lat, lon);

			// choose icon based on city 
			var icon;
			if(cities[i].yearRank == 1) {
				icon = 'assets/images/1.png';
			} else if (cities[i].city == "Atlanta") {
				icon = 'assets/images/atl.png';
			} else {
				icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569';
			}

        	var marker = createMarker(position, cities[i].city, icon);

        	// create HTML for the info window div
		   var markerContentHTML = '<div class="infoWindowContent">';
	       markerContentHTML += '<div class="total-pop">Total Population: ' + cities[i].yearEstimate + '</div>';
	       markerContentHTML += '<div class="pop-dens-last-year">2010 Census: ' + cities[i].lastCensus + '</div>';
	       markerContentHTML += '<div class="pop-change">Population Change %: ' + cities[i].change + '</div>';
	       markerContentHTML += '<div class="pop-dens">Population Density: ' + cities[i].lastPopDensity + '</div>';
	       markerContentHTML += '<div class="state">State: ' + cities[i].state + '</div>';
	       markerContentHTML += '<div class="land-area">Land Area: ' + cities[i].landArea + '</div>';
	       markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+', \'Atlanta, ga\')">Get directions</a>';
	       markerContentHTML += '</div>'; 

	       // put html onto marker content property
	       marker.content = markerContentHTML;

	       // add marker to markers array
	       $scope.markers.push(marker);

    	}
		
	}

	// put the cities object array into the angular controller scope
	$scope.cities = cities;
	$scope.items = $scope.cities; 
	$scope.createCityMarkers();

});