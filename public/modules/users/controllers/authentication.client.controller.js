'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$mdDialog', 'Authentication','RESOURCE_DOMAIN',
	function($scope, $http, $location, $mdDialog, Authentication, RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post(RESOURCE_DOMAIN + '/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// Close dialog
				$mdDialog.cancel();

				// And redirect to the index page
				$location.path('/projects');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post(RESOURCE_DOMAIN + '/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// Close dialog
				$mdDialog.cancel();

				// And redirect to the index page
				$location.path('/projects');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);