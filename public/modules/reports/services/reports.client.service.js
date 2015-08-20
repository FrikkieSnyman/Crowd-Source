'use strict';

//Reports service used to communicate Reports REST endpoints
angular.module('reports').factory('Reports', ['$resource', 'RESOURCE_DOMAIN',
	function($resource, RESOURCE_DOMAIN) {
		return $resource(RESOURCE_DOMAIN + '/reports/:reportId', {reportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
