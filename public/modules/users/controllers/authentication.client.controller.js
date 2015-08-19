'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$mdDialog', 'Authentication', 'RESOURCE_DOMAIN', '$mdToast',
	function($scope, $http, $location, $mdDialog, Authentication, RESOURCE_DOMAIN, $mdToast) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			if ($scope.confirmationPassword == $scope.credentials.password) {
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
			} else {
				$scope.error = "Your passwords do not match";
			}
		};

		$scope.signin = function() {
			$http.post(RESOURCE_DOMAIN + '/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// Close dialog
				$mdDialog.cancel();

				// And redirect to the index page
				$mdToast.show(
					$mdToast.simple()
						.content('Login successful')
						.position($scope.getToastPosition())
						.hideDelay(3000)
				);
				$location.path('/projects');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.toastPosition = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};

		$scope.getToastPosition = function() {
			return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
		};	
	}
]);
