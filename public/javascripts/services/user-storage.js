app.factory('UserStorageService', ['localStorageService', '$location', function(localStorageService, $location) { 
	var service = {};
	
    service.setUser = function(user){
		var user = localStorageService.set('user', user);
	}
	
    service.getUser = function(user){
		var user = localStorageService.get('user');
		return user;
	}
	
	return service;
}]);