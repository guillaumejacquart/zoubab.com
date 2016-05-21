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

app.run(['UserService', function(UserService){
  UserService.init();
}]);
var baseUrl = "";
var apiUrl = baseUrl + "/test/api";