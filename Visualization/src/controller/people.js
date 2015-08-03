/**
 * Created by chiwan on 7/28/2015.
 */

var d3Charts = angular.module('d3Charts');

d3Charts.controller('peopleCtrl', ['$scope', 'eventService', function($scope, eventService) {

    // controller.main.js
    eventService.register('addUser', function(user) {
        $scope.names.push(user);
    });

    $scope.names = ['Catherine Wang'];

}]);