app.controller('LoginCtrl', ['$scope', '$location', '$window', 'UserService', function ($scope, $location, $window, UserService) {
    
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
	
	vm.facebookLogin = function() {
		var url = '/auth/facebook',
			width = 1000,
			height = 650,
			top = (window.outerHeight - height) / 2,
			left = (window.outerWidth - width) / 2;
		$window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
	};
}]);