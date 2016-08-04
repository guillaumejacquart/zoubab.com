app.controller('HomeCtrl', ['$scope', 'UserStorageService', function ($scope, UserStorageService) {
    
	var vm = this;
	vm.user = UserStorageService.getUser();
}]);