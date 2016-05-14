app.controller('RegisterCtrl', ['$http', '$location', function ($http, $location) {
    
	var vm = this;
	vm.user = {};
	
	vm.submit = function(){
		$http.post('register', vm.user).then(function(response){
			localStorage.setItem('user', JSON.stringify(response.data));
			$location.path('/home');
		}, function(error){
		});
	};
}]);