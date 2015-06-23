angular.module('main')
.factory('userService', function($http) {
	return {
		logIn: function(username, password) {
			return $http.post('/login', {username: username, password: password});
		},
 
		logOut: function() {
 
		}
	}
});
