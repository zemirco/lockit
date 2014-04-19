
var app = angular.module('myApp.controllers', []);

/**
 * Main / Root controller
 */
app.controller('MainCtrl', function ($scope, user) {

  $scope.user = user.get();

  $scope.logout = function() {
    user.logout().then(function() {
      $scope.user = null;
    }, function(error) {
      console.log(error);
    });
  };

});

/**
 * Login controller
 */
app.controller('LoginCtrl', function ($scope, $window, user) {

  // submit form
  $scope.submit = function() {

    user.login($scope.login, $scope.password)
      .then(function() {
          $window.location = '/';
        }, function(error) {
          $scope.error = error;
        });

  };

});

/**
 * Signup controller
 */
app.controller('SignupCtrl', function ($scope, user) {

  // submit form
  $scope.submit = function() {

    user.signup($scope.name, $scope.email, $scope.password)
      .success(function(data, status) {
        $scope.error = false;
        $scope.success = 'Great! Check your inbox.';
      }).error(function(data, status) {
        $scope.success = false;
        $scope.error = data.error;
      });

  };

});

/**
 * SignupToken controller
 */
app.controller('SignupTokenCtrl', function ($scope, $routeParams, $http) {

  var token = $routeParams.token;

  $http.get('/rest/signup/' + token)
    .success(function(data, status) {
      $scope.success = true;
    })
    .error(function(data, status) {
      $scope.error = true;
    });


});
