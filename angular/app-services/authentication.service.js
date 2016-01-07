(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'SignUpService'];
    function AuthenticationService($http, $cookieStore, $rootScope, $timeout, SignUpService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(userData, callback) {

            /* Use this for real authentication
             ----------------------------------------------*/

            SignUpService.GetByEmailPass(userData)
                .then(function (response) {
                    callback(response);
                });

        }

        function SetCredentials(userData) {
            var authdata = Base64.encode(userData.username + ':' + userData.password + ':' + userData.rememberMe);

            $rootScope.globals = {
                currentUser: {
                    username: userData.username,
                    authdata: authdata
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }

})();