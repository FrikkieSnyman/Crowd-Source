
// This is our main module.
// Here we will help cahnge stuff
var app = angular.module('main', []);
app.controller('mainCtrl', function($scope,$http) {
    //$scope.firstName = "John";
    //$scope.lastName = "Doe";
    $scope.name = "Piet";
    $http.get("/names").success(function(response)
    {
    	console.log("We had a response");
    	$scope.names = response;
    	console.log($scope.names);
    });
});