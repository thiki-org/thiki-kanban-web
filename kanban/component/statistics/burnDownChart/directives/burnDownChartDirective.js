/**
 * Created by xubt on 04/06/17.
 */
kanbanApp.directive('burnDownChart', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'component/statistics/burnDownChart/partials/burn-down-chart.html',
        scope: false,
        controller: ['$scope', 'statisticsService', 'timerMessageService', function ($scope, statisticsService, timerMessageService) {
            var burnDownChartLink = $scope.board.sprint._links.burnDownChart.href;
            $scope.loadBurnDownChart = function () {
                var loadingInstance = timerMessageService.loading();
                statisticsService.loadBurnDownChart(burnDownChartLink).then(function (_burnDownChartData) {
                        var labels = [];
                        var burnDownCharts = _burnDownChartData.burnDownCharts;
                        var pointsArray = [];
                        for (var index in burnDownCharts) {
                            labels.push(burnDownCharts[index].sprintAnalyseTime);
                            pointsArray.push(burnDownCharts[index].restPoints);
                            if (index == (burnDownCharts.length - 1)) {
                                $scope.statisticsDataLastUpdateTime = burnDownCharts[index].modificationTime;
                            }
                        }
                        $scope.labels = labels;
                        $scope.data = [pointsArray];
                        $scope.series = ['剩余点数'];
                    }
                ).finally(function () {
                    timerMessageService.delayClose(loadingInstance);
                });
            };
            $scope.loadBurnDownChart();

            $scope.refreshBurnDownChart = function () {
                var loadingInstance = timerMessageService.loading();
                statisticsService.refreshBurnDownChart(burnDownChartLink).then(function () {
                    $scope.loadBurnDownChart();
                }).finally(function () {
                    timerMessageService.delayClose(loadingInstance);
                });
            };
        }]
    };
});
