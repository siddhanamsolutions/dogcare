'use strict';

angular.module('rad-app-site', ['ngRoute', 'ngTable'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/login.html',
				controller  : 'loginController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			})
			
			
			// route for the User List page
			.when('/userList', {
				templateUrl : 'pages/userList.html',
				controller  : 'userListController'
			})
			
			
			// route for the User List page
			.when('/addUser', {
				templateUrl : 'pages/addUser.html',
				controller  : 'DynamicFormCtrl'
			})
			// route for the Loacalization List page
			.when('/language', {
				templateUrl : 'pages/language.html',
				controller  : 'languageCtrl'
			})
			
			// route for the contact page
			.when('/expired', {
				templateUrl : 'pages/expired.html'
			})
			
			// route for the 
			.when('/editUser', {
				//templateUrl : 'pages/it_it/language.html',
				controller  : 'userListController'
			})
			
			// route for the contact page
			.when('/it_it', {
				templateUrl : 'pages/it_it/language.html',
					controller  : 'languageCtrl'
			})
			
			// route for the contact page
			.when('/en_us', {
				templateUrl : 'pages/en_us/language.html',
					controller  : 'languageCtrl'
			})
			
			// route for the 404 page
			.otherwise({
				templateUrl : 'pages/404.html'
			});
   
	}]);


/* App Module */

var app = angular.module('schedulerApp', [ ]);

app.controller('MainSchedulerCtrl', function($scope) {
  $scope.events = [
    { id:1, text:"Task A-12458",
      start_date: new Date(2013, 10, 12),
      end_date: new Date(2013, 10, 16) },
    { id:2, text:"Task A-83473",
      start_date: new Date(2013, 10, 22 ),
      end_date: new Date(2013, 10, 24 ) }
  ];

  $scope.scheduler = { date : new Date(2013,10,1) };

});

