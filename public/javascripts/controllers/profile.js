app.controller('ProfileCtrl', [
	'$scope', 
	'$location', 
	'UserService', 
	'UserStorageService',
	'FileUploader', function ($scope, $location, UserService, UserStorageService, FileUploader) {
    
	var vm = this;
	
	function getUser(){
		vm.user = UserStorageService.getUser();
		vm.user.picturePath = apiUrl + '/users/' + vm.user._id + '/picture?' + new Date().getTime();
	}
	getUser();
	
	vm.uploader = new FileUploader({
		url: apiUrl + '/users/' + vm.user._id + '/picture',
		headers: {
			'Authorization': 'Bearer ' + vm.user.token
		},
		queueLimit: 1,
		onAfterAddingFile: function(item){
			item.upload();
		},
		onSuccessItem: function(item, response, status, headers) {
			vm.uploader.clearQueue();
			getUser();
		}
	});

	// FILTERS

	vm.uploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	});
	
	vm.submit = function(){
		$scope.error = '';
		vm.saved = false;
		UserService.update(vm.user).then(function(user){
			vm.saved = true;
		}, function(error){
			$scope.error = error;
		});
	};
}]);