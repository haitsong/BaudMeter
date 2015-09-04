/* src/app.js */
// Application Module 
angular.module('myApp', ['d3Charts', 'ngRoute'])

// Setting configuration for application
.config(function ($routeProvider) {
  $routeProvider
      .when('/latency', {
        controller: 'LatencyCtrl',
        templateUrl: 'latency.html'
      })
      .when('/trace', {
        controller: 'TraceRouteCtrl',
        templateUrl: 'trace.html'
      })
      .when('/statistic', {
        controller: 'StatisticCtrl',
        templateUrl: 'statistic.html'
      })
      .otherwise({
        redirectTo: '/latency'
      });
})
