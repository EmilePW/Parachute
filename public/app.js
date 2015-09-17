'use strict';

angular.module('here', ['ngRoute', 'door3.css']);

angular.module('here')
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider

		// Landing page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'homeCtrl',
			css: 'styles/homeStyle.css'
		})

		// Choose a category
		.when('/categories', {
			templateUrl: 'views/categories.html',
			controller: 'categoriesCtrl',
			css: 'styles/categories.css'
		})

		// Choose a place
		.when('/choices', {
			templateUrl: 'views/choices.html',
			controller: 'choicesCtrl'
		})

		.otherwise({
			redirectTo: '/'
		})
	}]);

angular.module('here').controller('homeCtrl', ['$scope', function($scope) {

}]);

angular.module('here').controller('categoriesCtrl', ['$scope', function($scope) {
	$scope.categories = [
		{
			name: 'RESTAURANTS',
			icon: 'cutlery'
		},
		{
			name: 'BARS',
			icon: 'glass'
		},
		{
			name: 'LANDMARKS',
			icon: 'university'
		}
	];
}]);

angular.module('here').controller('choicesCtrl', ['$scope', function($scope) {

}]);


