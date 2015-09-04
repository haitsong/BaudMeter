angular.module('d3Charts')

    .controller('CoLatencyViewCtrl', ['$scope', 'eventService',
        function ($scope, eventService) {
            $scope.currentSelectCo = "";
            $scope.mouse_leave = true;
            $scope.mouse_over = false;

            $scope.pickCo = function(co){
                eventService.publish('newCoSelection', co.Id);

                $scope.currentSelectCo = co.Id;
            };

            eventService.register("newCountySelection", function(countyId){
                $scope.$apply(function(){
                    if($scope.coListIndex == 0)
                        $scope.coListIndex = 1;
                    else
                        $scope.coListIndex = 0;
                })
            });

            $scope.coListIndex = 0;
            $scope.coInfo = [
                [
                    {
                        Id : 'Co1',
                        OfficeIp : '201.5.71.22',
                        InComingQps : 4075,
                        Latency50 : 25.3,
                        Latency75 : 23.3,
                        Latency95 : 20.1
                    },
                    {
                        Id : 'Co2',
                        OfficeIp : '201.5.74.52',
                        InComingQps : 4075,
                        Latency50 : 57.3,
                        Latency75 : 23.3,
                        Latency95 : 20.1
                    },
                    {
                        Id : 'Co3',
                        OfficeIp : '201.5.75.23',
                        InComingQps : 4075,
                        Latency50 : 48.5,
                        Latency75 : 23.3,
                        Latency95 : 20.1
                    },
                    {
                        Id : 'Co4',
                        OfficeIp : '203.5.71.22',
                        InComingQps : 9985,
                        Latency50 : 22.7,
                        Latency75 : 23.3,
                        Latency95 : 20.1
                    },
                    {
                        Id : 'Co5',
                        OfficeIp : '203.5.74.52',
                        InComingQps : 875,
                        Latency50 : 44.3,
                        Latency75 : 37.3,
                        Latency95 : 26.1
                    },
                    {
                        Id : 'Co6',
                        OfficeIp : '203.5.75.23',
                        InComingQps : 10075,
                        Latency50 : 65.3,
                        Latency75 : 53.3,
                        Latency95 : 40.1
                    }
                ],
                [
                    {
                        Id : 'Co1',
                        OfficeIp : '201.5.24.22',
                        InComingQps : 4075,
                        Latency50 : 45.7,
                        Latency75 : 23.3,
                        Latency95 : 29.1
                    },
                    {
                        Id : 'Co2',
                        OfficeIp : '201.5.23.52',
                        InComingQps : 4075,
                        Latency50 : 69.3,
                        Latency75 : 23.3,
                        Latency95 : 20.1
                    },
                    {
                        Id : 'Co3',
                        OfficeIp : '201.5.25.23',
                        InComingQps : 4075,
                        Latency50 : 38.5,
                        Latency75 : 23.3,
                        Latency95 : 20.1
                    },
                    {
                        Id : 'Co4',
                        OfficeIp : '203.5.26.22',
                        InComingQps : 9985,
                        Latency50 : 29.7,
                        Latency75 : 23.3,
                        Latency95 : 20.1
                    },
                    {
                        Id : 'Co5',
                        OfficeIp : '203.5.27.52',
                        InComingQps : 875,
                        Latency50 : 77.3,
                        Latency75 : 37.3,
                        Latency95 : 26.1
                    },
                    {
                        Id : 'Co6',
                        OfficeIp : '203.5.28.23',
                        InComingQps : 10075,
                        Latency50 : 45.3,
                        Latency75 : 53.3,
                        Latency95 : 40.1
                    },
                    {
                        Id : 'Co7',
                        OfficeIp : '203.5.29.23',
                        InComingQps : 10075,
                        Latency50 : 43.8,
                        Latency75 : 53.3,
                        Latency95 : 40.1
                    },
                    {
                        Id : 'Co8',
                        OfficeIp : '203.5.30.23',
                        InComingQps : 10075,
                        Latency50 : 66.2,
                        Latency75 : 53.3,
                        Latency95 : 40.1
                    }
                ]
            ]
        }]);
