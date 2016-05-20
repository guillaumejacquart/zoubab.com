app.controller('RegisterCtrl', ['$location', 'UserService', function ($location, UserService) {
    
	var vm = this;
	vm.user = {};
	
	vm.submit = function(){
		delete vm.error;
		UserService.register(vm.user).then(function(user){
			$location.path('/home');
		}, function(error){
			vm.error = error;
		});
	};
}]);