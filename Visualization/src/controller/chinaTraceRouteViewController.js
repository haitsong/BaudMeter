angular.module('d3Charts')

// Main application controller
    .controller('ChinaTraceRouteViewCtrl', ['$scope',
        function ($scope) {
            $scope.lineInstances = "src/data/instances.json";
            $scope.chinaMap = "src/data/ChinaXMap.json";
            $scope.chinaCityCountyCode = "src/data/ChinaCityCountyCodes.json";
            $scope.getcountycolor = GetCountyColor;
        }]);
