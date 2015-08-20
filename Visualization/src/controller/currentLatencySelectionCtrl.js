angular.module('d3Charts')

    .controller('CurrentLatencySelectionCtrl', ['$scope', 'eventService', 'latencyDataService',
    function($scope, eventService, latencyDataService){
        $scope.countyGB = latencyDataService.GetCountyGB1999();
        $scope.coId = latencyDataService.GetCoId();

        eventService.register('selectNewCountyLatency', function (obj) {
            $scope.countyGB = obj;
            latencyDataService.SetCountyGB1999(obj);
        });

        eventService.register('selectNewCo', function (obj) {
            $scope.coId = obj;
            latencyDataService.SetCoId(obj);
        })
    }]);
