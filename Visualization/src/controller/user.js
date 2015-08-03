/**
 * Created by chiwan on 7/28/2015.
 */

angular.module('d3Charts')
    .controller('userCtrl', ['$scope','eventService', function ($scope, eventService) {
        $scope.newUser = "";
        $scope.users = [];

        $scope.addUser = function(user){
            $scope.users.push(user);
            eventService.publish('addUser', user);
        };
    }]);

