'use strict';

var app = angular.module('myApp.controllers', []);

/**
 * Index controller
 */
app.controller('IndexCtrl', function ($scope, $http) {
  
  $scope.username = null;
  
  $http.get('/rest/whoami')
    .success(function(data, status) {
      $scope.username = data.username;
    })
    .error(function(data, status) {
      // do something
    })
  
});

/**
 * Index controller
 */
app.controller('LogoutCtrl', function ($scope, $http, $window) {
  
  $scope.error = '';

  $scope.logout = function() {
    $http.get('/rest/logout')
      .success(function(data, status) {
        $window.location = '/'
      })
      .error(function(data, status) {
        $scope.error = 'you are not logged in';
      })
  }

});

/**
 * Login controller 
 */
app.controller('LoginCtrl', function ($scope, $http, $window) {
  
  // show login error
  $scope.error = null;
      
  // submit form
  $scope.submit = function() {
    
    $http.post('/rest/login', {
      login: $scope.login,
      password: $scope.password
    }).success(function(data, status) {
      $window.location = '/';
    }).error(function(data, status) {
      $scope.error = data.error;
    })
    
  };
    
});

/**
 * Signup controller
 */
app.controller('SignupCtrl', function ($scope, $http) {

  // show error or success message
  $scope.message = null;

  // submit form
  $scope.submit = function() {

    $http.post('/rest/signup', {
      username: $scope.username,
      email: $scope.email,
      password: $scope.password
    }).success(function(data, status) {
      $scope.message = 'Great! Check your inbox.'
    }).error(function(data, status) {
      $scope.message = data.error;
    })

  };

});

/**
 * SignupToken controller
 */
app.controller('SignupTokenCtrl', function ($scope, $routeParams, $http) {

  var token = $routeParams.token;
  
  $scope.success = null;
  
  $http.get('/rest/signup/' + token)
    .success(function(data, status) {
      console.log(data);
      $scope.success = true;
    })
    .error(function(data, status) {
      console.log('error');
      console.log(data);
      console.log(status)
    })
  

});