angular.module('main')
.factory('authenticationService', function() {
    var auth = {
        isLogged: false
    }
 
    return auth;
});
// appServices.factory('UserService', function($http) {
//     return {
//         logIn: function(username, password) {
//             return $http.post(options.api.base_url + '/login', {username: username, password: password});
//         },
 
//         logOut: function() {
 
//         }
//     }
// });