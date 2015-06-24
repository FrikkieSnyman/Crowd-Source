(function() {
	'use strict';
	angular
			.module('main')
			.controller('estimationCtrl', project);
	function project() {
		//$http({method:'GET', url:'/projects'}).success(function(data) {
		//this.projects = data;})
		this.projectName = '';
		this.projects = ['Project1', 'Project2', 'Project3', 'Project4'];
		this.name = null;
		this.estimatorNames = ['Hugo', 'Andre', 'Frikkie'];

	}
})();
