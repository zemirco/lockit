'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute',
  'myApp.controllers'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
      controller: 'IndexCtrl'
    }).
    when('/login', {
      templateUrl: 'partials/login',
      controller: 'LoginCtrl'
    }).
    when('/logout', {
      templateUrl: 'partials/logout',
      controller: 'LogoutCtrl'
    }).
    when('/signup', {
      templateUrl: 'partials/signup',
      controller: 'SignupCtrl'
    }).
    when('/signup/:token', {
      templateUrl: 'partials/signupToken',
      controller: 'SignupTokenCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
