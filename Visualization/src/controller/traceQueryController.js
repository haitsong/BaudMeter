var d3Charts = angular.module('d3Charts');

function getcountycolor(gb1999)
{

}

d3Charts.controller('traceQueryCtrl', ['$scope', 'eventService', function($scope, eventService) {

    $scope.traceRouteQuery =
    {
        province: 32,
        gb1999: 321281,
        zoomScale: 13,
        coOfficeIp: "201.192.1.201",
        targetSite: "sohu"
    };

    $scope.search = function(traceRouteQuery){
        //console.log(traceRouteQuery);

        eventService.publish("search_route", traceRouteQuery);
    };
}]);