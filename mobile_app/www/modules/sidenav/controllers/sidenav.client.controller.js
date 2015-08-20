'use strict';

angular.module('sidenav').controller('SidenavController', ['$scope', '$http', '$mdDialog', '$location', 'Authentication' , 'Logindialog', '$mdUtil', '$mdSidenav', '$log', 'RESOURCE_DOMAIN',
	function($scope, $http, $mdDialog, $location, Authentication, Logindialog, $mdUtil, $mdSidenav, $log, RESOURCE_DOMAIN) {
		// Sidenav controller logic
		$scope.authentication = Authentication;

		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}

		$scope.signinDialog = function(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'modules/users/views/authentication/signin.client.view.html',
				parent: angular.element(document.body),
				targetEvent: ev
			});
		};

		$scope.signupDialog = function(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'modules/users/views/authentication/signup.client.view.html',
				parent: angular.element(document.body),
				targetEvent: ev
			});
		};

		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function() {
				$mdSidenav(navID)
				.toggle()
				.then(function() {
					$log.debug('toggle ' + navID + ' is done');
				});
			}, 300);
			return debounceFn;
		}

		$scope.toggleLeft = buildToggler('left');
		/**
 		* Build handler to open/close a SideNav; when animation finishes
 		* report completion in console
 		*/

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.signOut = function() {
			$http.get(RESOURCE_DOMAIN + '/auth/signout').success(function(response) {
				$location.path(response);
			});

			$http.get(RESOURCE_DOMAIN + '/auth/signout').success(function(response) {
				// If successful we assign null to the global user model
				$scope.authentication.user = null;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				// $scope.error = response.message;
			});
		};
	}
])
.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
	$scope.close = function() {
		$mdSidenav('left').close()
		.then(function() {
			$log.debug('close LEFT is done');
		});
	};
});
