app.factory('UserStorageService', ['localStorageService', '$location', function(localStorageService, $location) { 
	var service = {};
	var anonymousPaths = ['/login', '/register'];
	
    service.setUser = function(user){
		var user = localStorageService.set('user', user);
	}
	
    service.getUser = function(user){
		var user = localStorageService.get('user');
		if((!user || !user.token) && anonymousPaths.indexOf($location.path()) == -1){
			$location.path('/login');
			return;
		}
		return user;
	}
	
	return service;
}]);