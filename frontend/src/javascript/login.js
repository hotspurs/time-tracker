angular.module('login', ['ui.bootstrap']).controller('loginCtrl', function ($scope, $window, $http) {

  $scope.onSubmit = function(e){
    e.preventDefault();
    var email = $scope.email,
        password = $scope.password;

    if(!email || !password) return;

    $http.post('/login', {
        email: email,
        password: password,
     })
     .success(function(data) {
        console.log(data);
        if(data.message){
          $scope.error = true;
          $scope.errorMessage = data.message;
        }

        if(data.redirect){
          window.location = '/';
        }

     });
  }

});

angular.module('login').controller('registerCtrl', function ($scope, $window, $http) {

  $scope.onSubmit = function(e){
    e.preventDefault();
    var email = $scope.email,
        name = $scope.name,
        password = $scope.password;

    if(!email || !password || !name) return;

    $http.post('/register', {
        email: email,
        name: name,
        password: password
     })
     .success(function(data) {
        console.log(data);
        if(data.message){
          $scope.error = true;
          $scope.errorMessage = data.message;
        }

        if(data.redirect){
          window.location = '/';
        }
     });
  }

});
