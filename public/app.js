'use strict';

angular.module('parachute', ['ngRoute', 'door3.css', 'ngAnimate', 'ngTouch']);

// Factory to share data about categories between views
angular.module('parachute').factory('CategoryData', function($http) {
	var currentCategory;

	return {
		// Save chosen category for reuse
		saveCategory: function(data) {
			currentCategory = data;
		},
		getCategory: function() {
			if(typeof currentCategory === 'undefined') {
				alert('No category found');	
			} else {
				return currentCategory;
			}
		},
		getChoicesFromCategory: function() {
			// Get choices from db given for chosen category
			return $http.get('db/choices.json')
						.then(function(response) {
							// Return array of choices on success
							return response.data[currentCategory];
						});
		}
	}
});

// Factory to share data about choices between views
angular.module('parachute').factory('ChoiceData', function($http) {
	var currentChoice;

	return {
		// Save chosen choice for reuse
		saveChoice: function(data) {
			currentChoice = data;
			console.log(currentChoice);
		},
		getChoice: function() {
			if(typeof currentChoice === 'undefined') {
				alert('No choice found');
			} else {
				return currentChoice;
			}
		},
		getMapFromChoice: function() {

		}
	}
});

// Geolocation factory
angular.module('parachute').factory('LocationData', function($http) {
	var currentLocation = {
		latitude: null,
		longitude: null
	};

	return {
		saveLocation: function() {
			navigator.geolocation.getCurrentPosition(
		   		function(response) {
		   			var location = response.coords;
		   			currentLocation.latitude = location.latitude;
		   			currentLocation.longitude = location.longitude;
		   		}
		   	);
		},
		getLocation: function() {
			if(typeof currentLocation === 'undefined') {
				alert('Location not stored');
			} else {
				return currentLocation;
			}
		},
		// Haversine formula to calculate distance between two points
		haversine: function(firstLocation, secondLocation) {
			// Radius of the Earth (in km)
			var r = 6371;

			function toRadians(angle) {
				return angle * Math.PI / 180;
			}


			function halfChordSquare(a, b) {
				return Math.pow( Math.sin( toRadians( Math.abs( a - b)) / 2), 2);
			}

			var a = halfChordSquare(firstLocation.latitude, secondLocation.latitude)
					+ halfChordSquare(firstLocation.longitude, secondLocation.longitude)
					* Math.cos(toRadians(firstLocation.latitude))
					* Math.cos(toRadians(secondLocation.latitude));

			console.log(c(a));

			function c(a) {
				return 2 * Math.atan2(Math.sqrt(a), Math.sqrt((1 - a)));
			}

			//return distance between points in km
			return r * c(a);

		},
		//Distance is in km
		nearbyLocations: function(distance, choices) {
			
			var nearbyChoices = [];
			for(var i = 0; i < choices.length; i++) {
				if( this.haversine(this.getLocation(), choices[i].location) < distance ) {
					nearbyChoices.push(choices[i]);
				}
			}

			return nearbyChoices;
		}
	}
});

angular.module('parachute')
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider

		// Landing page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'homeCtrl'
		})

		// Choose a category
		.when('/categories', {
			templateUrl: 'views/categories.html',
			controller: 'categoriesCtrl'
		})

		// Choose a place
		.when('/choices', {
			templateUrl: 'views/choices.html',
			controller: 'choicesCtrl'
		})

		.when('/map', {
			templateUrl: 'views/map.html',
			controller: 'mapCtrl'
		})

		.otherwise({
			redirectTo: '/'
		})
	}]);

angular.module('parachute').controller('homeCtrl', ['$scope', 'LocationData', function($scope, LocationData) {
	$scope.saveLocation = LocationData.saveLocation;
}]);

angular.module('parachute').controller('categoriesCtrl', ['$scope', 'CategoryData', function($scope, CategoryData) {
	$scope.chooseCategory = function(data) {
		CategoryData.saveCategory(data);
	}

	$scope.categories = [
		{
			name: 'restaurants',
			icon: 'cutlery'
		},
		{
			name: 'bars',
			icon: 'glass'
		},
		{
			name: 'landmarks',
			icon: 'university'
		}
	];
}]);

angular.module('parachute').controller('choicesCtrl', ['$scope', 'CategoryData', 'ChoiceData', 'LocationData', function($scope, CategoryData, ChoiceData, LocationData) {
	
	// Get choices given category and successful request
	CategoryData.getChoicesFromCategory().then(function(choices) {
		$scope.choices = choices;
		console.log(LocationData.nearbyLocations(1, choices));
	});

	$scope.whatAmI = function() {
		$scope.visible ? $scope.visible = false : $scope.visible = true;
	}

	$scope.currentIndex = 0;

	$scope.nextChoice = function() {
		$scope.currentIndex = ($scope.currentIndex + 1) % $scope.choices.length;
	}

	$scope.prevChoice = function() {
		// Prevent negative values of index
		$scope.currentIndex === 0 ? 
			$scope.currentIndex = $scope.choices.length - 1 :		
			$scope.currentIndex = ($scope.currentIndex - 1) % $scope.choices.length;
	}

	$scope.chooseChoice = function(data) {
		ChoiceData.saveChoice(data);
	}

	$scope.works = function() {
		console.log('It works');
	}
}]);

angular.module('parachute').controller('mapCtrl', ['$scope', 'LocationData', 'ChoiceData', function($scope, LocationData, ChoiceData) {
	$scope.currentLocation = LocationData.getLocation();

	$scope.makeMap = function() {
		var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer;
		var mapCanvas = document.getElementById('map');
        var mapOptions = {
          center: new google.maps.LatLng(
          	$scope.currentLocation.latitude,
          	$scope.currentLocation.longitude
          ),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);
        directionsDisplay.setMap(map);

    	$scope.findDirections(directionsService, directionsDisplay);
    }

    $scope.findDirections = function(directionsService, directionsDisplay) {
    	var request = {
    		origin: new google.maps.LatLng(
	        	$scope.currentLocation.latitude,
	          	$scope.currentLocation.longitude
	        ),
    		destination: new google.maps.LatLng(
    			ChoiceData.getChoice().location.latitude,
    			ChoiceData.getChoice().location.longitude
    		),
    		travelMode: google.maps.TravelMode.WALKING
    	}

    	directionsService.route(request, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				console.log(response);
				directionsDisplay.setDirections(response);
			} else {
				console.log(status);
			}
		});
    }

    $scope.makeMap();
}]);

