app.factory('sessionInjector', ['$location', 'UserStorageService', 'SocketService', function($location, UserStorageService, SocketService) {  
    var sessionInjector = {
        request: function(config) {
			try{
				var token = UserStorageService.getToken();
				if (token) {
					config.headers['Authorization'] = 'Bearer ' + token;
				}
				return config;
			}
			catch(err){
				return config;
			}
        },
		responseError: function(response) {
            // Session has expired
            if (response.status == 401 && $location.path() != '/login'){
				SocketService.socket.disconnect();
                $location.path('/login');
            }
			return response;
        }
    };
    return sessionInjector;
}]);

app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);