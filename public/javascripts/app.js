var app = angular.module('app', [
  'ngRoute'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/chat', {
        templateUrl: 'partials/chat.html',
        controller: 'ChatCtrl',
		controllerAs: 'chat'
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
      otherwise({
        redirectTo: '/chat'
      });
  }]);