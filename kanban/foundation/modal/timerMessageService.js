/**
 * Created by xubt on 9/24/16.
 */

kanbanApp.provider('timerMessageService', ['$injector',
    function ($injector) {
        function sleep(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        }

        this.$get = function ($uibModal, $timeout) {
            var instance;
            return {
                message: function (_message, _type) {
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'foundation/modal/partials/tip-dialog.html',
                        controller: [
                            '$scope',
                            '$uibModalInstance', '$interval',
                            function ($scope, $uibModalInstance, $interval) {
                                $scope.message = _message;
                                $scope.timerMessage = "3秒后自动关闭";
                                $scope.type = _type === undefined ? 'ok' : _type;
                                var count = 2;
                                $scope.timer = $interval(function () {
                                    if (count === 0) {
                                        $interval.cancel($scope.timer);
                                        $uibModalInstance.dismiss('cancel');
                                    }
                                    else {
                                        $scope.timerMessage = count + "秒后自动关闭";
                                    }
                                    count--;
                                }, 1000);
                            }
                        ],
                        size: 'sm',
                        backdrop: "static"
                    });
                },
                confirmMessage: function (_message, _type) {
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                        controller: [
                            '$scope',
                            '$uibModalInstance',
                            function ($scope, $uibModalInstance) {
                                $scope.title = "确认信息";
                                $scope.message = _message;
                                $scope.type = _type === undefined ? 'ok' : _type;
                                $scope.ok = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            }
                        ],
                        size: 'sm',
                        backdrop: "static"
                    });
                },
                loading: function (_message) {
                    if (instance !== undefined) {
                        return instance;
                    }

                    instance = $uibModal.open({
                        animation: false,
                        templateUrl: 'foundation/modal/partials/loading-dialog.html',
                        controller: [
                            '$scope',
                            '$uibModalInstance', '$interval',
                            function ($scope) {
                                $scope.message = _message;
                            }
                        ],
                        size: 'loading',
                        backdropClass: 'loading-windows',
                        backdrop: 'static'
                    });
                    return instance;
                },
                close: function (_modalInstance) {
                    _modalInstance.dismiss('cancel');
                    instance = undefined;
                },
                delayClose: function (_modalInstance) {
                    $timeout(function () {
                        _modalInstance.dismiss('cancel');
                        instance = undefined;
                    }, 1000);
                }
            };
        };
    }]);
