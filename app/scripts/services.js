'use strict';

angular.module('deepPocketsApp')
.constant("baseURL", "http://deeppocketsnode.mybluemix.net/api/")

.factory('accountsFactory', ['$resource', 'baseURL',
	function ($resource, baseURL) {

	var accountFac = {};
	
	accountFac.getAccounts = $resource(baseURL + "Customers/:id/accounts", null, {
		'update': { method: 'PUT' }
	});
	
	accountFac.saveAccount = $resource(baseURL + "Accounts/:id", null, {
		'update': { method: 'PUT' }
	});
	
	return accountFac;
}])

.factory('transactionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
	var transactFac = {};
	
	transactFac.getTransactionsOfAccount = $resource(baseURL + "Accounts/:id/transactions", null, {
		'update': { method: 'PUT' }
	});
	
	transactFac.getTransactions = $resource(baseURL + "Customers/:id/transactions", null, {
		'update': { method: 'PUT' }
	});
	
	transactFac.saveTransaction = $resource(baseURL + "Transactions/:id", null, {
		'update': { method: 'PUT' }
	});
	return transactFac;
}])

.factory('profileFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
	var proFac = {};
	
	proFac.getProfile = $resource(baseURL + "Customers/:id", null, {
		'update': { method: 'PUT' }
	});
	
	return proFac;
}])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
	function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    
    var authFac = {};
    var TOKEN_KEY = 'deepPocketToken';
    var isAuthenticated = false;
    var username = '';
	var userId = '';
    var authToken;
	var justRegistered = false;
	
	function useCredentials(credentials) {
		isAuthenticated = true;
		username = credentials.username;
		userId = credentials.userId;
		authToken = credentials.token;
		$http.defaults.headers.common['x-access-token'] = authToken;
	}

	function loadUserCredentials() {
		var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
		if (credentials.username !== undefined) {
			useCredentials(credentials);
		}
	}

	function storeUserCredentials(credentials) {
		$localStorage.storeObject(TOKEN_KEY, credentials);
		useCredentials(credentials);
	}

	function destroyUserCredentials() {
		authToken = undefined;
		username = '';
		userId = '';
		isAuthenticated = false;
		$http.defaults.headers.common['x-access-token'] = authToken;
		$localStorage.remove(TOKEN_KEY);
	}
     
    authFac.login = function(loginData) {
        $resource(baseURL + "Customers/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, userId:response.userId, token: response.id});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
				isAuthenticated = false;
				if(response.data === null) {
					authFac.popMessage("No Internet Connection<br><small>Please try again later</small>");
				}
				else if (response.data.error.statusCode === 401) {
					authFac.popMessage("Login Failed<br><small>Please verify your credentials</small>");
				}
				$rootScope.$broadcast('login:Failed');
           }
        );
    };
    
    authFac.logout = function() {
        $resource(baseURL + "Customers/logout").save(function(){});
        destroyUserCredentials();
		authFac.popMessage("Logout Successful");
    };
    
    authFac.register = function(registerData) {
        $resource(baseURL + "Customers")
        .save(registerData,
			function() {
				justRegistered = true;
				authFac.login({username:registerData.username, password:registerData.password});
				$localStorage.storeObject('deepPocketUserInfo',
						{username:registerData.username, password:registerData.password});
				$rootScope.$broadcast('registration:Successful');
			},
			function(response){
				if(response.data === null) {
					authFac.popMessage("No Internet Connection<br><small>Please try again later</small>");
				}
				else {
					var message = response.data.error.details.messages.email;
					authFac.popMessage("Registration Failed<br><small>"+message+"</small>");
				}
				$rootScope.$broadcast('registration:Failed');
			}
        );
    };
	
	authFac.handleError = function(response) {
		if(response.data === null) {
			return true;
		}
		else if (response.data.error.statusCode === 401) {
			destroyUserCredentials();
			$rootScope.loggedIn = false;
			authFac.popMessage("Session Expired<br><small>Please login again</small>");
		}
	};
	
    authFac.popMessage = function(message) {
		var code = '<div class="ngdialog-message"><div><h3>'+message+'</h3></div>' +
			'<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ' +
			'ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div>';
		ngDialog.openConfirm({ template: code, plain: 'true'});
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };
	
    authFac.getUserId = function() {
        return userId;  
    };
	
    authFac.getJustRegistered = function() {
        return justRegistered;  
    };
	
    authFac.setJustRegistered = function(x) {
        justRegistered = x;  
    };
	
	authFac.notification = function(x, y, z) {
		$.notify({
			icon: x,
			message: y
		},{type: z, timer: 1000 });
	};

    loadUserCredentials();
    
    return authFac;
    
}])
;