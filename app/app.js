'use strict';

angular.module('here', ['ngRoute', 'door3.css', 'ngAnimate']);

angular.module('here')
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

			// Sub-categories
			.when('/restaurants', {
				templateUrl: 'views/restaurants.html',
				controller: 'restaurantsCtrl'
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

angular.module('here').controller('restaurantsCtrl', ['$scope', function($scope) {
	$scope.whatAmI = function() {
		$scope.visible = true;
	}
}]);

angular.module('here').controller('choicesCtrl', ['$scope', function($scope) {
	$scope.whatAmI = function() {
		$scope.visible ? $scope.visible = false : $scope.visible = true;
	}

	$scope.currentIndex = 0;

	$scope.nextChoice = function() {
		$scope.currentIndex = ($scope.currentIndex + 1) % $scope.choices.length;
	}

	$scope.prevChoice = function() {($scope.currentIndex + 1) % $scope.choices.length
		// Prevent negative values of index
		$scope.currentIndex === 0 ? 
			$scope.currentIndex = $scope.choices.length - 1 :		
			$scope.currentIndex = ($scope.currentIndex - 1) % $scope.choices.length;
	}

	$scope.choices = [
			{
				name: 'Chateaux Mimeux',
				description: 'Rustic French Cuisine',
				price: '£££',
				image: 'https://images.unsplash.com/photo-1428259067396-2d6bd3827878?q=80&fm=jpg&s=6d1a4b4472cda3fa55bd0da1919e22e2'
			},
			{
				name: 'All Organic',
				description: 'Fresh Organic Sandwich Bar',
				price: '££',
				image: 'https://images.unsplash.com/photo-1429012178110-d7a734a56176?q=80&fm=jpg&s=b4823ac3378dc87ec9f3f5e36c306681'
			},
			{
				name: 'Sugar Man',
				description: 'Sweet Bakery',
				price: '£',
				image: 'https://images.unsplash.com/photo-1422919869950-5fdedb27cde8?q=80&fm=jpg&s=79e6ea67e8fd37af2833db624571ff0d'
			},
			{
				name: 'Freddie P\'s Fried Chicken',
				description: 'Greasy, Southern Fred and Delicious',
				price: '£',
				image: 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?q=80&fm=jpg&s=2c89e023814a3fdb98edc129cf1357c2'
			},
			{
				name: 'Bison',
				description: 'Michelin-Starred Steakhouse',
				price: '££££',
				image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?q=80&fm=jpg&s=c417a5af0232c852b0eac1b8a8976320'
			},
			{
				name: 'Crunch Time',
				description: 'Relaxed Vegan Bistro',
				price: '££',
				image: 'https://images.unsplash.com/reserve/oMRKkMc4RSq7N91OZl0O_IMG_8309.jpg?q=80&fm=jpg&s=9f0adb6c4d9775850a615a4fda2083fa'
			},
			{
				name: 'Ocarina',
				description: 'Modern Mediterranean Fusion' ,
				price: '£££',
				image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&fm=jpg&s=66c5f8478d54feddba8cfc9b901a4e32'
			}
		];
}]);


