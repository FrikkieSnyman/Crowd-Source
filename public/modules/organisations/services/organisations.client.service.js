'use strict';

//Organisations service used to communicate Organisations REST endpoints
angular.module('organisations').factory('Organisations', ['$resource',
	function($resource) {
		return $resource('organisations/:organisationId', { organisationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);