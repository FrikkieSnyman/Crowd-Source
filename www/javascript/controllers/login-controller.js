angular.module('main')
.controller('loginCtrl', ['$scope', '$location', '$window', '$mdDialog', 'userService', 'authenticationService',
	function($scope, $location, $window, $mdDialog, userService, authenticationService) {
		$scope.logInOut = function(ev) {
			if (!authenticationService.isLogged) {
				showAdvanced(ev);
			} else {
				logout();
			}
		};

		showAdvanced = function(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: '../../templates/pages/login/index.html',
				parent: angular.element(document.body),
				targetEvent: ev,
			});
		};

		$scope.logIn = function logIn(username, password) {
			if (username !== undefined && password !== undefined) {
				userService.logIn(username, password).
				success(function(data) {
					authenticationService.isLogged = true;
					$window.sessionStorage.token = data.token;

					$mdDialog.hide();

					$location.path("/projects");
				}).error(function(status, data) {
					console.log(status);
					console.log(data);

					console.log("Login failed");
				});
			}
		};

		logout = function logout() {
			if (authenticationService.isLogged) {
				authenticationService.isLogged = false;
				delete $window.sessionStorage.token;
				$location.path("/");

				console.log('Loggin out');
			}
		};

		$scope.isLogged = function isLogged() {
			return authenticationService.isLogged;
		};
	}]);

function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
	$mdDialog.hide();
  };
	$scope.cancel = function() {
	$mdDialog.cancel();
  };
}

