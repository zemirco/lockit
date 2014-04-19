
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.controllers',
  'myApp.services'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'views/index.html'
    }).
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).
    when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'SignupCtrl'
    }).
    when('/signup/:token', {
      templateUrl: 'views/signupToken.html',
      controller: 'SignupTokenCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
