'use strict';

angular.module('sidenav').factory('Logindialog', [
	function() {
		// Logindialog service logic
		// ...
		var properties = {
			signin: true,
			signup: false,
			forgotPass: false
		};

		// Public API
		return properties;
	}
]);
