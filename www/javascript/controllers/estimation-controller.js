(function() {
	'use strict';
	angular
			.module('main')
			.controller('estimationCtrl', estimators);
	function estimators ($timeout, $q) {
		var self = this;
		self.name = null;
		self.estimatorNames = ['Hugo', 'Andre', 'Frikkie'];
		self.tags = [];
	}
})();
