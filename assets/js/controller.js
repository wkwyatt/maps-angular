var myApp = angular.module('myApp', []);
myApp.controller('mapCtrl', function($scope) {

	var mapOption = {
		zoom: 4,
			// center of the united states
		center: new google.maps.LatLng(40.0000, -98.0000), 
		mapTypeId: google.maps.mapTypeId.TERRAIN
	}

	$scope.map = new google.maps.Map(document.getElementById('map'),)
	$scope.markers = [];

	var infoWindow = new google.maps.infoWindow();

	$scope.cities = cities;
	
});