angular.module('d3Charts')

// Main application controller
    .controller('ProvinceLatencyViewCtrl', ['$scope',
        function ($scope) {

            /*
             to do:
             1. add event register service .
             2. pass event to another view.
             */

            $scope.latency = "src/data/jiangsu_county_latency.csv";
            $scope.countyMap = "src/data/JiangSuCounty.json";

        }]);