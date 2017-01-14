/**
 * Created by xubt on 01/14/17.
 */

kanbanApp.controller('autoExitController', ['$scope', '$uibModal', '$interval', '$rootScope', '$location',
    function ($scope, $uibModal, $interval, $rootScope, $location) {
        $rootScope.isAutoExitWarningDialogWasOpened = false;
        $interval(function () {
            var twoSecondAgo = moment().add(-60 * 5, "s");
            if ((moment(twoSecondAgo).isAfter($rootScope.lastestOperationTime)) && !$rootScope.isAutoExitWarningDialogWasOpened && $location.path() != "/welcome") {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'foundation/safety/partials/auto-exit-system-warning.html',
                    controller: ['$scope', 'teamsService', 'timerMessageService', '$uibModalInstance', 'localStorageService',
                        function ($scope, teamsService, timerMessageService, $uibModalInstance, localStorageService) {
                            $rootScope.isAutoExitWarningDialogWasOpened = true;
                            $scope.message = "您已经5分钟未操作系统，为了保证您的数据安全，系统即自动退出。";
                            $scope.timerMessage = "20秒后自动退出";
                            var count = 20;
                            $scope.timer = $interval(function () {
                                if (count === 0) {
                                    $interval.cancel($scope.timer);
                                    localStorageService.clearAll();
                                    localStorageService.set("isAutoExit", true);
                                    $uibModalInstance.close();
                                    $location.path("/welcome");
                                }
                                else {
                                    $scope.timerMessage = count + "秒后自动退出";
                                }
                                count--;
                            }, 1000);
                            $scope.finishCardsOperation = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }],
                    size: 'sm'
                });
            }
        }, 1000);
    }]);
