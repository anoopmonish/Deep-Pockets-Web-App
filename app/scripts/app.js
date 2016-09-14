'use strict';

angular.module('deepPocketsApp', ['ui.router', 'ngResource', 'ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        
	$stateProvider
	
		.state('app', {
			url:'/',
			views: {
				'login': {
					templateUrl : 'views/login.html',
					controller  : 'LoginCtrl'
				},
				'header': {
					templateUrl : 'views/header.html',
				},
				'content': {
					templateUrl : 'views/dashboard.html',
					controller  : 'DashboardCtrl'
				},
				'footer': {
					templateUrl : 'views/footer.html',
					controller  : 'FooterCtrl'
				}
			}

		})
	
		.state('app.accounts', {
			url:'accounts',
			views: {
				'content@': {
					templateUrl : 'views/accounts.html',
					controller  : 'AccountsCtrl'                  
				}
			}
		})
		
		.state('app.records', {
			url:'records/:id',
			views: {
				'content@': {
					templateUrl : 'views/records.html',
					controller  : 'RecordsCtrl'                  
				}
			}
		})
	
		.state('app.transaction', {
			url:'transaction',
			views: {
				'content@': {
					templateUrl : 'views/transaction.html',
					controller  : 'TransactionCtrl'                  
				}
			}
		})

		.state('app.reports', {
			url: 'reports',
			views: {
				'content@': {
					templateUrl : 'views/reports.html',
					controller  : 'ReportsCtrl'
				}
			}
		})
	
		.state('app.profile', {
			url: 'profile',
			views: {
				'content@': {
					templateUrl : 'views/profile.html',
					controller  : 'ProfileCtrl'
			   }
			}
		})
		
		.state('app.settings', {
			url: 'settings',
			views: {
				'content@': {
					templateUrl : 'views/settings.html',
					controller  : 'SettingsCtrl'
			   }
			}
		})
		
		.state('app.contactus', {
			url: 'contactus',
			views: {
				'content@': {
					templateUrl : 'views/contactus.html',
					controller  : 'ContactCtrl'
			   }
			}
		});

	$urlRouterProvider.otherwise('/');
})
;
