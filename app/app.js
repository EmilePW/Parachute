'use strict';

angular.module('parachute', ['ngRoute', 'door3.css', 'ngAnimate']);

angular.module('parachute').factory('CategoryData', function($http) {
	var storedCategory;

	return {
		// Save chosen category for reuse
		saveCategory: function(data) {
			storedCategory = data;
		},
		getCategory: function() {
			return storedCategory;
		},
		getChoices: function() {
			// Get choices from db given for chosen category
			return $http.get('db/choices.json')
						.then(function(response) {
							// Return array of choices on success
							return response.data[storedCategory];
						});
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

angular.module('parachute').controller('homeCtrl', ['$scope', function($scope) {

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

angular.module('parachute').controller('choicesCtrl', ['$scope', 'CategoryData', function($scope, CategoryData) {
	
	// Get choices given category and successful request
	CategoryData.getChoices().then(function(choices) {
		$scope.choices = choices;
	});

	console.log(CategoryData.getCategory());

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
}]);

angular.module('parachute').controller('mapCtrl', ['$scope', function($scope) {

}]);

