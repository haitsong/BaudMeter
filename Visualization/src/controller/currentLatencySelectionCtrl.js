angular.module('d3Charts')

    .controller('CurrentLatencySelectionCtrl', ['$scope', 'eventService', 'latencyDataService',
    function($scope, eventService, latencyDataService){
        $scope.countyGB = latencyDataService.GetCountyGB1999();
        $scope.coId = latencyDataService.GetCoId();

        $scope.updateCountyGB = function(obj){
            // this event is trigger by D3 component, Angular won't be aware of it, so need to use apply to tell Angular the Model is change, need refresh UI.
            $scope.$apply(function(){
                $scope.countyGB = obj;
                latencyDataService.SetCountyGB1999(obj);
            });
        };

        $scope.updateCoId = function(obj) {
           // $scope.$apply(function(){
            // If this function is trigger by angular behavior, there is no need to use apply, since Angular will do it for you.
                $scope.coId = obj;
                latencyDataService.SetCoId(obj)
            //});
        };

        eventService.register('selectNewCountyLatency', $scope.updateCountyGB);

        eventService.register('selectNewCo', $scope.updateCoId);
    }]);
