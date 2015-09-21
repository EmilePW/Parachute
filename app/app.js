'use strict';

angular.module('parachute', ['ngRoute', 'door3.css', 'ngAnimate']);

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

angular.module('parachute').controller('restaurantsCtrl', ['$scope', function($scope) {
	$scope.whatAmI = function() {
		$scope.visible = true;
	}
}]);

angular.module('parachute').controller('choicesCtrl', ['$scope', 'CategoryData', 'ChoiceData', function($scope, CategoryData, ChoiceData) {
	
	// Get choices given category and successful request
	CategoryData.getChoicesFromCategory().then(function(choices) {
		$scope.choices = choices;
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

