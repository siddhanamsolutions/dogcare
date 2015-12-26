'use strict';

angular.module('rad-app-site')
.factory('Auth', function($http){
    //var serviceURL = "http://172.23.63.136:5050",
    var serviceURL= '/dogCareService';

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {        
        login: function(user, success, error) {
            $http.post(serviceURL + '/dogcare/getLogin', user, {withCredentials: true}).success(function(user){
                success(user);
            }).error(error);
        },logout: function(success, error) {
            $http.get(serviceURL + '/logout').success(function(){
                changeUser({ username: '' });
                success();
            }).error(error);
        }
    };
})
.factory('UserManagement', function($http){

    //var serviceURL = "http://172.23.63.136:5050",
    var serviceURL= '/dogcareService';

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {        
        addUser: function(user, success, error) {
            $http.post(serviceURL + '/dogcare/addUser', user).success(function(res){
                success(res);
            }).error(error);
        },
        deleteUser: function(userId, success, error) {
            $http.delete(serviceURL + '/dogcare/deleteUser/'+userId).success(function(res){
                success(res);
            }).error(error);
        },
        updateUser: function(user, success, error) {
            $http.post(serviceURL + '/dogcare/updateUser', user).success(function(res){
                success(res);
            }).error(error);
        },
        searchUser: function(name, success, error) {
            $http.get(serviceURL + '/dogcare/searchUser/'+name).success(function(res){
                success(res);
            }).error(error);
        },
        getUsers: function(success, error) {
            $http.get(serviceURL + '/dogcare/users').success(function(res){
              success(res);
            }).error(error);
        }
    
    };
})
.factory('LangFactory', ['$rootScope', '$http', 'ErrorFactory', 'UtilFactory',
    function($rootScope, $http, ErrorFactory, UtilFactory) {
            var serviceURL= '/dogcare/';     
            $rootScope.langData = {};
            $rootScope.displayLang = "en_US";   // Currently displayed lang data is ...
            $rootScope.loadLang = "en_US";      // Currently loaded lang data is ...
            $rootScope.resetCurrentPage = [];   // Array that a form registers a function that has label changing codes


            function loadLangData(lang, errorFunc, successFunc) {
                    var args = arguments;
                    $http.get(serviceURL+'lang/' + lang + '/' + lang + '.json')
                        .success(function(data, status, headers, config) {
                            // Load the lang data from ajax call
                            $rootScope.langData = data;
                            // Currently loaded lang data is ...
                            $rootScope.loadLang = lang;
                            //console.log("Currently loaded lang data is ..." + $rootScope.loadLang);
                            if(args.length === 3)
                                successFunc(); // callback
                        })
                        .error(errorFunc);
            };

            // Load lang messages initially
            loadLangData($rootScope.displayLang, function(err) { // !TODO handle in local lang
                    alert("can't load Lang Data");
            });

            // Load error msgs initially
            ErrorFactory.loadLangErr($rootScope.displayLang, function(err) { // !TODO handle in local lang
                    alert("can't load error messages");
            });
            
            function changeSelectOptions(elem) {
                    console.log(elem.type);
                    if(elem.type === 'select' || elem.type === 'radio') {
                            // All options are stored in values variable
                            var tOptions = elem.values;
                            // Values are array of objects
                            if(UtilFactory.isDefined(tOptions) && UtilFactory.isArray(tOptions)) {
                                    for(var opt in tOptions) {
                                            // Does value object have current lang? If so, overwrite
                                            var tLangOpt = tOptions[opt][$rootScope.displayLang];
                                            if(UtilFactory.isDefined(tLangOpt) &&
                                                UtilFactory.isString(tLangOpt))
                                                    tOptions[opt].name = tOptions[opt][$rootScope.displayLang];
                                    }
                            }
                    }
            }
    
    
        return {        
                loadLang: loadLangData,

                detectLang: function() {

                },

                changeLang: function(formName, formFields, mode) {
                        // Set rootScope values to formFields
                        var langVars = $rootScope.langData[formName];
                        
                        // Fields in object mode
                        if(typeof mode !== 'undefined' && mode === 'static') { // Object form !TODO change everything to object
                                // Loop through dynamic fields
                                for(var prop in formFields) {
                                        // If field name founf, replace with lang labels
                                        if(typeof langVars[prop] !== 'undefined') {
                                                formFields[prop].labelName = langVars[prop].label;
                                                formFields[prop].place = langVars[prop].place;
                                        }
                                        
                                        // If field type select / radio, and lang params comes within options,
                                        // change lang
                                        changeSelectOptions(formFields[prop]);
                                }
                        }
                        else { // Array mode. currently addUser (Dynamic)
                                if(typeof langVars !== "undefined") { // !TODO else switch to default lang
                                        for(var i = 1; i < formFields.length; i++) { // 0 is for settings object
                                                if(UtilFactory.isDefined(langVars[formFields[i].name])) {
                                                        formFields[i].labelName = langVars[formFields[i].name].label;
                                                        formFields[i].place = langVars[formFields[i].name].place;
                                                }
                                                
                                                // If field type select / radio, and lang params comes within options,
                                                // change lang
                                                changeSelectOptions(formFields[i]);
                                        }
                                }
                        }

                        // Currently displayed lang data is loaded lang
                        $rootScope.displayLang = $rootScope.loadLang;
                        // Load error msgs
                        ErrorFactory.loadLangErr($rootScope.displayLang, function(err) { // !TODO handle in local lang
                            alert("can't load error messages");
                        });
                }
        };
}])
.factory('ErrorFactory', ['$rootScope', '$http', function($rootScope, $http) {
    var serviceURL= '/dogcare/';   
    $rootScope.langErrorData = {};
    var defaultErr = "e000";
    return {        
        loadLangErr: function(lang, errorFunc, successFunc) {
            var args = arguments;
            //console.log(serviceURL+'lang/' + lang + '/' + lang + '-err.json');
            $http.get(serviceURL+'lang/' + lang + '/' + lang + '-err.json')
                .success(function(data, status, headers, config) {
                    // Load the lang error data from ajax call
                    $rootScope.langErrorData = data;
                    //console.log("Currently loaded lang data is ..." + $rootScope.loadLang);
                    if(args.length === 3)
                        successFunc(); // callback
                })
                .error(errorFunc);
        },
                
        fetchErrorMsg: function(errorCode) {
            var errMsg = "";
            
            if($rootScope.langErrorData.length <= 0)
                alert("Failed to load error languages"); // !TODO automate it?
            else if(typeof $rootScope.langErrorData[errorCode] !== 'object') // write plugin code
                errMsg = $rootScope.langErrorData[defaultErr].msg;
            else
                errMsg = $rootScope.langErrorData[errorCode].msg;
            
            return errMsg;
        },
                
        errorFunction: function(err) {
                alert("Error function");
        }
    };
}]
)

.factory('UtilFactory', ['$http', 'ErrorFactory', '$rootScope', function($http, ErrorFactory, $rootScope) {
        
        
        function cloneObject(obj) {
                    var temp;                    
                    temp = angular.extend({}, obj);
                    
                    return temp;
        };
        function getJson(url, callback) {
                $http.get(url)
                .success(function(data, status, headers, config) {
                        //alert(status);
                        //return data;
                        callback(data);
                })
                .error(ErrorFactory.errorFunction);
        };
        
        function isDefined(prop) {
                var status = false;
                
                if(typeof prop !== 'undefined') 
                    status = true;

                return status;
        };

        function isArray(prop) {
                var status = false;
                
                if(typeof prop === 'object' && typeof prop.length !== 'undefined') 
                    status = true;

                return status;
        };
        
        function isString(prop) {
                var status = false;
                
                if(typeof prop === 'string') 
                    status = true;

                return status;
        }; 
        
        function isObject(prop) {
                var status = false;
                
                if(typeof prop === 'object') 
                    status = true;

                return status;
        };
        
        return {
                cloneObject: cloneObject,
                getJson: getJson,
                
                isDefined: isDefined,
                isArray: isArray,
                isObject: isObject,
                isString: isString
        };
        
        
}]);