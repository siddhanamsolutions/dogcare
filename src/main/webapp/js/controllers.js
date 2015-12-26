'use strict';

/* Controllers */
angular.module('rad-app-site').controller(
		'loginController',
		[ '$rootScope', '$scope', '$location', '$window', 'Auth', 'LangFactory', 'ErrorFactory',
				function($rootScope, $scope, $location, $window, Auth, LangFactory, ErrorFactory)
				{
					$scope.rememberme = true;
					$scope.login = function()
					{
						Auth.login({
							userName : $scope.username,
							password : $scope.password,
							role : "user"
						}, function(res)
						{
							//alert(JSON.stringify(res));
							if (res.responseCode === 'RES_L100')
							{
								//alert(ErrorFactory.fetchErrorMsg('RES_L100'));
								$scope.error = ErrorFactory.fetchErrorMsg('RES_L100');
							}
							else if (res.responseCode === 'RES_L200')
							{
								//alert(ErrorFactory.fetchErrorMsg('RES_L200'));
								$location.path('userList');
							}
						}, function(err)
						{
							$scope.error = "Failed to login";
						});
					};

					$scope.staticFields = {
						pageHeader : {
							labelName : 'Log In',
							name : 'pageHeader',
							type : 's'
						},
						userName : {
							labelName : 'Username',
							name : 'username',
							type : 's'
						},
						password : {
							labelName : 'Password',
							name : 'password',
							type : 's'
						},
						rememberMe : {
							labelName : 'Remember Me',
							name : 'rememberme',
							type : 's'
						},
						loginButton : {
							labelName : 'Log in',
							name : 'loginButton',
							type : 's'
						}
					};
					
                                        // Change the language of the form (if needed) !TODO
                                        function setLabels() {
                                            LangFactory.changeLang("login", $scope.staticFields, 'static');
                                        }
                                        setLabels();
                                        $rootScope.resetCurrentPage.push(setLabels);
				} ])

.controller(
		'userListController',
		[
				'$rootScope',
				'$scope',
				'$location',
				'$window',
				'UserManagement',
				'ngTableParams',
				function($rootScope, $scope, $location, $window, UserManagement, ngTableParams)
				{
					$scope.userList = $rootScope.userListResponse;
					loadUserList();
					function loadUserList()
					{
						UserManagement.getUsers(function(res)
						{
							loadTable(res);
						}, function(err)
						{
							$rootScope.error = "Error in getting User List. Please try again.";
						});
					}
					function loadTable(res)
					{
						$scope.userList = res;
						if ($scope.tableParams)
						{
							$scope.tableParams.reload();
						}
						else
						{
							$scope.tableParams = new ngTableParams({
								page : 1, // show first page
								count : 10, // count per page
								sorting : {
									name : 'asc' // initial sorting
								}
							}, {
								total : $scope.userList.length, // length of data
								getData : function($defer, params)
								{
									$defer.resolve($scope.userList.responseData.data.slice( (params.page() - 1) * params.count(), params
											.page()
											* params.count()));
								}
							});
						}
					}
					$scope.deleteUser = function(userId)
					{

						if (!confirm("Are you sure to delete this record."))
						{
							return;
						}
						UserManagement.deleteUser(userId, function(res)
						{

							if (res.responseCode === 'RES_UD100')
							{
								alert(ErrorFactory.fetchErrorMsg('RES_UD100'));
								$scope.error = ErrorFactory.fetchErrorMsg('RES_UD100');
							}
							else if (res.responseCode === 'RES_UD200')
							{
								alert(ErrorFactory.fetchErrorMsg('RES_UD200'));
								loadUserList(res);
							}
							//$window.location = '/index.html#';
						}, function(err)
						{
							$rootScope.error = "Error in adding user Please try again.";
						});

					};

					$scope.searchUser = function(searchText)
					{
						if ($scope.search === undefined)
						{
							alert("Please enter some search text...");
							return;
						}

						UserManagement.searchUser($scope.search, function(res)
						{
							if (res.responseCode === 'RES_US101')
							{
								alert(ErrorFactory.fetchErrorMsg('RES_US101'));
								$scope.error = ErrorFactory.fetchErrorMsg('RES_US101');
							}
							else if (res.responseCode === 'RES_US200')
							{
								alert(JSON.stringify(res));
								loadTable(res);
								alert(res.data.length + " "+ErrorFactory.fetchErrorMsg('RES_US200'));
							}
							/*if (res.data.length <= 0)
							{
								alert("No User for the Searched Text...");
								return;
							}*/
							alert(res.data.length + " Records Found...");
							loadTable(res);
							//$window.location = '/index.html#';
						}, function(err)
						{
							$rootScope.error = "Error in adding user Please try again.";
						});
					};

					$scope.editUser = function(userDetails)
					{
						alert("Edit user " + JSON.stringify(userDetails));
						$rootScope.models = userDetails;
						$rootScope.isEditable = 'yes';
						$location.path('addUser');

					};

				} ])

.controller('aboutController', [ '$rootScope', '$scope', '$location', '$window', function($rootScope, $scope, $location, $window)
{
	$scope.message = 'Look! I am an about page.';
} ])

.controller('contactController',
		[ '$rootScope', '$scope', '$location', '$window', function($rootScope, $scope, $location, $window)
		{
			$scope.message = 'Contact us! JK. This is just a demo.';
		} ])

.controller(
		'DynamicFormCtrl',
		[ '$rootScope', '$scope', '$location', '$window', 'UserManagement', '$timeout', 'LangFactory', 'UtilFactory', 'ErrorFactory',
				function($rootScope, $scope, $location, $window, UserManagement, $timeout, LangFactory, UtilFactory, ErrorFactory)
				{
                                        $scope.phoneItemsCount = 0;
                                        $scope.userAddsCount = 0;
                                        loadFormFiledsDynamically();
                                        
                                        if($rootScope.models !== 'undefined' && $rootScope.isEditable==='yes'){
                                                $scope.models = $rootScope.models;
                                                console.log($rootScope.models);
                                        }else{
                                                $scope.models = {};
                                                createModels($scope.userFields, 'userFields');
                                                createModels($scope.userAddresses, 'userAddresses');
                                                createModels($scope.userPhone, 'userPhone');
                                        }
                                        
                                        $scope.staticFields = {  
                                                pageHeader:{
                                                        labelName : 'Add User',
                                                        name : 'pageHeader',
                                                        type : 's'
                                                },
                                                createUserButton: {
                                                        labelName : 'Create user',
                                                        name : 'createUserButton',
                                                        type : 's'
                                                }
                                        };                                        
                                        
                                        // Change the language of the form (if needed) !TODO
                                        function setLabels() {
                                                LangFactory.changeLang("addUser", $scope.userFields);
                                                for (var i = 0; i < $scope.addrDetails.length; i++)
                                                        LangFactory.changeLang("addUser", $scope.addrDetails[i]);
                                                for (var i = 0; i < $scope.phoneDetails.length; i++)
                                                        LangFactory.changeLang("addUser", $scope.phoneDetails[i]);
                                                    
                                                // static fields
                                                LangFactory.changeLang("addUser", $scope.staticFields, 'static');
                                        };
                                        setLabels();
                                        $rootScope.resetCurrentPage.push(setLabels);

                                        // JSON to build form dynamically
					function loadFormFiledsDynamically() {
						$scope.userFields = [
							{
									repeats: false
							},
							{
							labelName : 'First Name',
							name : 'firstName',
							type : 'text',
							minLength : '3',
                            maxLength: '9',
							required : 'true'

						}, {
							labelName : 'Last Name',
							name : 'lastName',
							type : 'text',
							required : 'true'
						}, {
							labelName : 'SSN Number',
							name : 'ssn',
							type : 'text',
							required : 'true'

						}, {
							labelName : 'Username',
							name : 'name',
							type : 'text',
							required : 'true'
						}, {
							labelName : 'Password',
							name : 'password',
							type : 'password',
							required : 'true'
						}, {
							labelName : 'Email',
							name : 'email',
							type : 'email',
							required : 'true'
						},

						{
							labelName : 'Gender',
							name : 'gender',
							type : 'radio',
							values : [ {
								name : 'Unspecified',
								value : 'U',
                                                                en_US: 'Unspecified',
                                                                hi_IN: 'अनिर्दिष्ट',
                                                                it_IT: 'imprecisato'
							}, {
								name : 'Male',
								value : 'M',
                                                                en_US: 'Male',
                                                                hi_IN: 'पुरुष',
                                                                it_IT: 'Maschio'
							}, {
								name : 'Female',
								value : 'F',
                                                                en_US: 'Female',
                                                                hi_IN: 'महिला',
                                                                it_IT: 'Femminile'
							}

							]
						} ];

						$scope.userAddresses = [ {
							repeats : true
						}, {
							labelName : 'Address Type',
							name : 'addressType',
							type : 'select',
							values : [ {
								name : 'Home',
								value : '1',
                                                                en_US: 'Home',
                                                                hi_IN: 'घर',
                                                                it_IT: 'Casa'
							}, {
								name : 'Business',
								value : '2',
                                                                en_US: 'Business',
                                                                hi_IN: 'व्यापार',
                                                                it_IT: 'Attività Commerciali'
							} ]
						}, {
							labelName : 'Line1',
							name : 'line1',
							type : 'text',
                                                        minLength : '3',
                                                        maxLength: '9',
							required : 'true'
						}, {
							labelName : 'Line2',
							name : 'line2',
							type : 'text',
                                                        minLength : '3',
                                                        maxLength: '9',
							required : 'true'
						}, {
							labelName : 'City',
							name : 'city',
							type : 'text',
                                                        minLength : '3',
                                                        maxLength: '9',
							required : 'true'
						}, {
							labelName : 'State',
							name : 'state',
							type : 'select',
							values : [ {
								name : 'KAR',
								value : '1',
                                                                en_US: 'KAR',
                                                                hi_IN: 'कर्नाटक',
                                                                it_IT: 'KAR'
							}, {
								name : 'AND',
								value : '2',
                                                                en_US: 'AND',
                                                                hi_IN: 'आंध्र',
                                                                it_IT: 'AND'
							}, {
								name : 'TML',
								value : '3',
                                                                en_US: 'TML',
                                                                hi_IN: 'तमिलनाडु',
                                                                it_IT: 'TML'
							}, {
								name : 'KRL',
								value : '4',
                                                                en_US: 'KRL',
                                                                hi_IN: 'केरल',
                                                                it_IT: 'KRL'
							} ]
						}, {
							labelName : 'Postal Code',
							name : 'zip',
							type : 'text',
							minLength : '3',
                                                        maxLength: '9',
							required : 'true'
						} ];
						$scope.addrDetails = [];
						$scope.addrDetails[0] = $scope.userAddresses;

						$scope.userPhone = [ {
							repeats : true
						}, {
							labelName : 'Phone Number',
							name : 'phoneNumber',
							type : 'text',
							minLength : '3',
                                                        maxLength: '9',
                                                        pattern: '/[0-9]/',
							required : 'true'
						}, {
							labelName : 'Phone Type',
							name : 'phoneType',
							type : 'select',
							values : [ {
								name : 'Mobile',
								value : '1',
                                                                en_US: 'Mobile',
                                                                hi_IN: 'मोबाइल',
                                                                it_IT: 'Mobile'
							}, {
								name : 'Home',
								value : '2',
                                                                en_US: 'Home',
                                                                hi_IN: 'घर',
                                                                it_IT: 'Casa'
							}, {
								name : 'Business',
								value : '3',
                                                                en_US: 'Business',
                                                                hi_IN: 'व्यापार',
                                                                it_IT: 'Attività Commerciali'
							}, {
								name : 'Fax',
								value : '4',
                                                                en_US: 'Fax',
                                                                hi_IN: 'फैक्स',
                                                                it_IT: 'Fax'
							} ]
						}, {
							labelName : 'Country',
							name : 'countryId',
							type : 'select',
							values : [ {
								name : 'India',
								value : 1,
                                                                en_US: 'India',
                                                                hi_IN: 'भारत',
                                                                it_IT: 'India'
							}, {
								name : 'Pakistan',
								value : 2,
                                                                en_US: 'Pakistan',
                                                                hi_IN: 'पाकिस्तान',
                                                                it_IT: 'Pakistan'
							}, {
								name : 'South Africa',
								value : 3,
                                                                en_US: 'South Africa',
                                                                hi_IN: 'दक्षिण अफ्रीका',
                                                                it_IT: 'Sud Africa'
							}, {
								name : 'USA',
								value : 4,
                                                                en_US: 'USA',
                                                                hi_IN: 'अमेरीका',
                                                                it_IT: 'Fax'
							} ]
						} ];
						$scope.phoneDetails = [];
						$scope.phoneDetails[0] = $scope.userPhone;
					}

					function createModels(addToModels, objName)
					{
						if (typeof addToModels !== 'object' || !addToModels.length || addToModels.length <= 1)
							return;

						if (addToModels[0].repeats === false)
						{
							for (var i = 1; i < addToModels.length; i++)
							{
								$scope.models[addToModels[i].name] = "";
							} // 0 is settings object
						}
						else
						{
							$scope.models[objName] = [];
							$scope.models[objName][0] = {};
							for (var i = 1; i < addToModels.length; i++)
							{
								$scope.models[objName][0][addToModels[i].name] = "";
							}
						}
					};

					$scope.addPhonePanel = function(addModel)
					{
						var phoneItem = UtilFactory.cloneObject($scope.userPhone);

						$scope.phoneItemsCount++; // Add new panel

						// If not edit mode, add models
						//if(typeof addModel === 'undefined' || addModel === true || addModel !== null) {
						$scope.models['userPhone'][$scope.phoneItemsCount] = {};

						for ( var item in phoneItem)
						{
							//phoneItem[item].name = phoneItem[item].name + $scope.phoneItemsCount;

							if (typeof phoneItem[item].name === 'undefined') // avoid settings object
								continue;
							$scope.models['userPhone'][$scope.phoneItemsCount][phoneItem[item].name] = "";
						}

						//}

						$scope.phoneDetails.push(phoneItem);
						//console.log($scope.phoneDetails);

					};

					$scope.addAddressPanel = function(addModel)
					{
						//alert("Addr panel");
						var addrItem = UtilFactory.cloneObject($scope.addrDetails[0]);

						$scope.userAddsCount++; // Add new panel

						// If not edit mode, add models
						//if(typeof addModel === 'undefined' || addModel === true || addModel !== null) {
						$scope.models['userAddresses'][$scope.userAddsCount] = {};
						for ( var item in addrItem)
						{
							if (typeof addrItem[item].name === 'undefined') // avoid settings object
								continue;

							//addrItem[item].name = addrItem[item].name; // + $scope.userAddsCount;

							$scope.models['userAddresses'][$scope.userAddsCount][addrItem[item].name] = "";
						}
						//}

						// Add UI
						$scope.addrDetails.push(addrItem);
					};

					$scope.postData = function()
					{

						if (!$scope.addUserForm.$valid)
						{
							alert("please fill all details before submission");
							return false;
						}
						console.log($scope.models);

						var data = $scope.models;
						UserManagement.addUser(data, function(res)
						{
							alert("User Added Successfully..." + res);
							$location.path('userList');
							$rootScope.success = "User has been added successfully.";
							$timeout(function()
							{
								$rootScope.success = undefined;
							}, 5000);
						}, function(err)
						{
							alert("Failed to add user" + err);
							$rootScope.error = "Error in saving task management. Please try again.";
						});

					};

					$scope.editUser = function()
					{
						UtilFactory.getJson('json/EditUser.json', editUserImpl);

					};
                                        
                                        function editUserImpl(data) {
                                                $scope.staticFields.pageHeader.labelName = $rootScope.langData.addUser["editHeader"].label;
                                                //console.log($rootScope.langData);
                                                
                                                //var dirty = false;
                                                // Find arrays and construct page accordingly
                                                for(var item in data) {
                                                        if(typeof data[item] === 'object' &&
                                                        data[item].length) { // array {
                                                                
                                                                if(item === 'userAddresses') {
                                                                    // 0 is mandatory
                                                                    $scope.models[item][0] = data[item][0];
                                                                    for(var i = 1; i < data[item].length; i++) {
                                                                        $scope.addAddressPanel(false);     
                                                                        //dirty = true;
                                                                    }
                                                                }
                                                                else{
                                                                    // 0 is mandatory
                                                                    $scope.models[item][0] = data[item][0];
                                                                    for(var i = 1; i < data[item].length; i++) {
                                                                        $scope.addPhonePanel(false); 
                                                                        //dirty = true;
                                                                    }
                                                                }
                                                                
                                                        }
                                                        else {
                                                                $scope.models[item] = data[item];
                                                        }
                                                                
                                                }
                                                $rootScope.models = data;
                                                
                                                // If new panels are not added, populate data directly
                                                // TODO separate for each block
                                                //if(!dirty)
                                                    //$scope.test();
                                                //else {
                                                    // If new panels are added wait for them to render and then populate
                                                    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent, panel) {
                                                        //you also get the actual event object
                                                        //do stuff, execute functions -- whatever...
                                                        //console.log("on " + panel);
                                                        $scope.test(panel);
                                                    });
                                                //}
                                        };
                                        
                                        $scope.test = function(panel) {
                                                $scope.models[panel] = $rootScope.models[panel];
                                                console.log(panel);
                                        };
                                        
                                        $scope.isInvalid = function(formname, name) {
                                                var status = false;

                                                var el = angular.element("#" + name);
                                                if(el.hasClass("ng-invalid") && el.hasClass("ng-dirty")) {
                                                        status = ErrorFactory.fetchErrorMsg('eC_FORM_INVALID');
                                                        
                                                        if(el.hasClass("ng-invalid-required"))
                                                                status = ErrorFactory.fetchErrorMsg('eC_FORM_REQUIRED');
                                                            
                                                        if(el.hasClass("ng-invalid-minlength"))
                                                                status = ErrorFactory.fetchErrorMsg('eC_FORM_MINLENGTH') 
                                                                    + " " + el.attr('ng-minlength');
                                                            
                                                        if(el.hasClass("ng-invalid-maxlength"))
                                                                status = ErrorFactory.fetchErrorMsg('eC_FORM_MAXLENGTH') 
                                                                    + " " + el.attr('ng-maxlength');
                                                }
                                                    
                                                return status;
                                        };
				} 
                    ]
            )
.controller(
		'addUserController',
		[ '$rootScope', '$scope', '$location', '$window', 'AppConfig', 'Auth', '$routeParams',
				function($rootScope, $scope, $location, $window, AppConfig, Auth, $routeParams)
				{
					$scope.roles = AppConfig.appRoles;
					//default values	
					$scope.gender = 'male';
					$scope.role = $scope.roles[0];

					$scope.register = function()
					{
						var postData = {
							Name : $scope.name,
							Gender : $scope.gender,
							email : $scope.email,
							password : $scope.password,
							Role : $scope.role.value,
							Address : $scope.address
						};

						UserManagement.addUser(postData, function(res)
						{

							alert("User added successfully...");
							//$window.location = '/index.html#';

						}, function(err)
						{
							$rootScope.error = "Error in adding user Please try again.";
						});

					};
				} ]).controller(
		'navController',
		[ '$rootScope', '$scope', '$route', '$http', 'LangFactory', 'ErrorFactory',
				function($rootScope, $scope, $route, $http, LangFactory, ErrorFactory)
				{
					$scope.staticFields = {
						navAddUser : {
							labelName : 'Add User',
							name : 'navAddUser',
							type : 's'
						},
						navHome : {
							labelName : 'Home',
							name : 'navHome',
							type : 's'
						},
						navAbout : {
							labelName : 'About',
							name : 'navAbout',
							type : 's'
						},
						navContact : {
							labelName : 'Contact',
							name : 'navContact',
							type : 's'
						},
						navLanguage : {
							labelName : 'Language',
							name : 'navLanguage',
							type : 's'
						}
					};
					
                                        function setNavLabels() {
                                            // Change the language of the form (if needed) !TODO
                                            LangFactory.changeLang("nav", $scope.staticFields, 'static');
                                        };
                                        $rootScope.resetCurrentPage.push(setNavLabels);
                                        
					$scope.changeLanguage = function(langID)
					{
						if (typeof langID === 'undefined')
						{
							//alert("This language is yet to be implemented");
							alert(ErrorFactory.fetchErrorMsg('eCNF001'));
						}
						else
						{
                                                        //console.log($rootScope.displayLang);
							if (langID === $rootScope.displayLang)
								alert("You are already viewing " + langID);
							else
							{
								// make ajax call to get lang json
								LangFactory.loadLang(langID, 
                                                                        function(err) {
                                                                                $scope.error = "Failed to load language";
                                                                                console.log(err);
                                                                        }, function() { // success function
                                                                                // A page can register what changes does it need after lang change
                                                                                if(typeof $rootScope.resetCurrentPage === 'object' &&
                                                                                    $rootScope.resetCurrentPage.length) {
                                                                                            var funs = $rootScope.resetCurrentPage;
                                                                                            
                                                                                            for(var i = 0; i < funs.length; i++) {
                                                                                                    if(typeof funs[i] === 'function')
                                                                                                            funs[i]();
                                                                                            }
                                                                                    }
                                                                        }
                                                                );
							}
						}
					};

				} ])
				.directive('onFinishRender', function($timeout, $rootScope)
				{
					return {
						restrict : 'A',
						link : function(scope, element, attr)
						{
                                                        var panel = element.attr("on-finish-render");
                                                        //console.log(scope[panel]);
                                                        //console.log($rootScope.models[panel]);
							if (scope.$last === true)
							{
								$timeout(function()
								{
									scope.$emit('ngRepeatFinished', panel);
								});
							}
						}
					};
				});
