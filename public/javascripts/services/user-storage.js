app.factory('UserStorageService', ['localStorageService', '$location', function (localStorageService, $location) {
	var service = {};
	var anonymousPaths = ['/login', '/register'];

	service.setUser = function (user) {
		localStorageService.set('user', user);
	}
	
	service.setToken = function (token) {
		localStorageService.set('token', token);
	}

	service.getUser = function (user) {
		return localStorageService.get('user');
	}

	service.getToken = function () {
		var token = localStorageService.get('token');
		if (!token && anonymousPaths.indexOf($location.path()) == -1) {
			$location.path('/login');
			return;
		}
		return token;
	}

	return service;
}]);