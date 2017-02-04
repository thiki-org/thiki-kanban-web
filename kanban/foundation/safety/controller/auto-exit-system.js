/**
 * Created by xubt on 01/14/17.
 */

kanbanApp.controller('autoExitController', ['$scope', '$uibModal', '$interval', '$rootScope', '$location', 'localStorageService',
    function ($scope, $uibModal, $interval, $rootScope, $location, localStorageService) {
        $rootScope.isAutoExitWarningDialogWasOpened = false;
        $interval(function () {
            if ((moment().isAfter($rootScope.autoExitTime)) && !$rootScope.isAutoExitWarningDialogWasOpened && $location.path() !== "/welcome") {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'foundation/safety/partials/auto-exit-system-warning.html',
                    controller: ['$scope', 'projectsService', 'timerMessageService', '$uibModalInstance', 'localStorageService', '$rootScope',
                        function ($scope, projectsService, timerMessageService, $uibModalInstance, localStorageService, $rootScope) {
                            $rootScope.isAutoExitWarningDialogWasOpened = true;
                            $scope.timerMessage = "20秒后自动退出";
                            var count = 19;
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
                            $scope.keepStay = function () {
                                $rootScope.autoExitTime = moment().add(kanbanApp.autoExitTime, "s");
                                $rootScope.isAutoExitWarningDialogWasOpened = false;
                                $interval.cancel($scope.timer);
                                $uibModalInstance.close();
                            };
                        }],
                    size: 'sm',
                    backdrop: "static"
                });
            }
        }, 1000);
    }]);
