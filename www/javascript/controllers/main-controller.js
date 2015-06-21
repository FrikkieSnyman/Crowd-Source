angular.module('main')
.controller('mainWelcomeCtrl',function($scope,$location){
	$scope.createProject = function()
	{
		console.log("Button press");
		$location.path( "/createProject" );
	}
});