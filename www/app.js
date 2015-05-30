
// This is our main module.
// Here we will help cahnge stuff
var app = angular.module('main', []);

app.controller('mainCtrl', function($scope,$http) {
    //$scope.firstName = "John";
    //$scope.lastName = "Doe";
    $scope.sendName = function()
    {
        console.log("Name!");
        // Simple POST request example (passing data) :
        // application/json
        // 
        $http.post('/name', {name:$scope.name,surname:$scope.surname}).
          success(function(data, status, headers, config) {
                $http.get("/names").success(function(response)
                {
                    console.log("We had a response");
                    $scope.names = response;
                    console.log($scope.names);
                });
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    }

    $http.get("/names").success(function(response)
    {
    	console.log("We had a response");
    	$scope.names = response;
    	console.log($scope.names);
    });

});