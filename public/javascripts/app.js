var app = angular.module('app', [
  'ngRoute',
  'LocalStorageModule',
  'angular-loading-bar',
  'angularFileUpload'
]);

app.config(['$routeProvider', 'localStorageServiceProvider',
  function ($routeProvider, localStorageServiceProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      }).
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      }).
      when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      }).
      otherwise({
        redirectTo: '/home'
      });

    localStorageServiceProvider
      .setPrefix('zoubab');
  }]);

app.run([
	'$window', 
	'$rootScope', 
	'UserService', 
	'UserStorageService', 
	'$location',
	function($window, $rootScope, UserService, UserStorageService, $location){
  UserService.init();
  
  $window.app = {
        authState: function(state, user) {
            $rootScope.$apply(function() {
                switch (state) {
                    case 'success':
                        UserStorageService.setUser(user);
						UserService.init();
						$location.path('/');
                        break;
                }

            });
        }
    };
}]);
var baseUrl = "";
var apiUrl = baseUrl + "/api";