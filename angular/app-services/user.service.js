(function () {
    'use strict';

    angular
        .module('app')
        .factory('SignUpService', SignUpService);

    SignUpService.$inject = ['$http'];
    function SignUpService($http) {
        var service = {};

        service.getSignUpRoot = getSignUpRoot;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function getSignUpRoot(){
            return $http.get(restApi+'/signUpRoot').then(handleSuccess, handleError('Error getting SignUpRootPageContent'));
        }

        function GetAll() {
            return $http.get(restApi+'/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(restApi+'/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get(restApi+'/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post(restApi+'/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put(restApi+'/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(restApi+'/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

            // private functions

            function handleSuccess(res) {
                return res.data;
            }

            function handleError(error) {
                return function () {
                    return { success: false, message: error };
                };
            }
        }

    })();
