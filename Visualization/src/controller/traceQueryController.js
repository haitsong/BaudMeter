var d3Charts = angular.module('d3Charts');

d3Charts.controller('traceQueryCtrl', ['$scope', 'eventService', 'latencyDataService',
    function($scope, eventService, latencyDataService) {

    $scope.traceRouteQuery =
    {
        province: 32,
        gb1999: latencyDataService.GetCountyGB1999(),
        zoomScale: 13,
        coOfficeIp: latencyDataService.GetCoId(),
        targetSite: "sohu"
    };

        /*
    $scope.updateCountyGB = function(obj){
        // this event is trigger by D3 component, Angular won't be aware of it, so need to use apply to tell Angular the Model is change, need refresh UI.
        $scope.$apply(function(){
            $scope.traceRouteQuery.gb1999 = obj;
        });
    };

    $scope.updateCoId = function(obj) {
        // $scope.$apply(function(){

        $scope.$apply(function(){
            $scope.traceRouteQuery.coOfficeIp = obj;
        });
    };
    */
    //eventService.register('selectNewCountyLatency', $scope.updateCountyGB);

    //eventService.register('selectNewCo', $scope.updateCoId);

    $scope.search = function(traceRouteQuery){
        eventService.publish("search_route", traceRouteQuery);
    };
}]);