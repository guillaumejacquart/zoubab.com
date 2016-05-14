app.factory('sessionInjector', ['$location', function($location) {  
    var sessionInjector = {
        request: function(config) {
			try{
				var user = JSON.parse(localStorage.getItem('user'));
				if (user && user.token) {
					config.headers['Authorization'] = 'Bearer ' + user.token;
				}
				return config;
			}
			catch(err){
				return config;
			}
        },
		responseError: function(response) {
            // Session has expired
            if (response.status == 401){
                $location.path('/login');
            }
        }
    };
    return sessionInjector;
}]);

app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);