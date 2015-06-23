angular.module('main')
.controller('loginCtrl', ['$scope', '$location', '$window', 'userService', 'authenticationService',
	function ($scope, $location, $window, userService, authenticationService) {
		$scope.logIn = function logIn(username, password) {
			if (username !== undefined && password !== undefined) {
				userService.logIn(username, password).
				success(function(data) {
					authenticationService.isLogged = true;
					$window.sessionStorage.token = data.token;
					// $location.path("/admin");
				}).error(function(status, data) {
					console.log(status);
					console.log(data);
				});
			}
		}

		$scope.logout = function logout() {
			if (authenticationService.isLogged) {
				authenticationService.isLogged = false;
				delete $window.sessionStorage.token;
				$location.path("/");
			}
		}
}]);
