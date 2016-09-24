/**
 * Created by xubt on 9/24/16.
 */

kanbanApp.provider('timerMessageService', ['$injector',
    function ($injector) {

        this.$get = function ($uibModal) {
            return {
                message: function (_message) {
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'foundation/modal/partials/tip-dialog.html',
                        controller: [
                            '$scope',
                            '$uibModalInstance', '$interval',
                            function ($scope, $uibModalInstance, $interval) {
                                $scope.message = _message;
                                $scope.timerMessage = "3秒后自动关闭";
                                var count = 5;
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
                        size: 'sm'
                    });
                }
            };
        };
    }]);
