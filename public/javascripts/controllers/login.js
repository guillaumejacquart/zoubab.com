app.controller('LoginCtrl', ['$scope', '$location', 'UserService', function ($scope, $location, UserService) {
    
	var vm = this;
	vm.user = {};
	
	vm.submit = function(){
		$scope.error = '';
		UserService.login(vm.user).then(function(user){
			$location.path('/home');
		}, function(error){
			$scope.error = error;
		});
	};
}]);