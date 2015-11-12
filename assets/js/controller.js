var myApp = angular.module('myApp', []);
myApp.controller('mapCtrl', function($scope) {

	var mapOption = {
		zoom: 4,
			// center of the united states
		center: new google.maps.LatLng(40.0000, -98.0000)
	}

	$scope.map = new google.maps.Map(document.getElementById('map'), mapOption);
	$scope.markers = [];

	var infoWindow = new google.maps.InfoWindow();
	var createMarker = function(city, index) {
		console.log(city);
		console.log(index);
		console.log(typeof(latLon));

		var latLon = city.latLon.split(',');
		var lat = latLon[0];
		var lon = latLon[1];

		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(lat, lon),
			title: city.city,
			icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569'
		});


	}
	$scope.cities = cities;
    for(i=0;i<cities.length;i++){
        createMarker(cities[i],i)
    }
});