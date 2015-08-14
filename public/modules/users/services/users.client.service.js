'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'RESOURCE_DOMAIN',
	function($resource, RESOURCE_DOMAIN) {
		return $resource(RESOURCE_DOMAIN + '/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
