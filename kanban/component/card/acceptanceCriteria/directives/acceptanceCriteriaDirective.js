/**
 * Created by xubt on 10/18/16.
 */
kanbanApp.directive('acceptanceCriteria', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/acceptanceCriteria/partials/acceptanceCriteria.html',
        replace: true,
        transclude: true,
        scope: {
            acceptanceCriteria: '=',
            stage: '='
        },
        controller: ['$scope', 'localStorageService', 'acceptanceCriteriaService', 'timerMessageService', 'toaster', function ($scope, localStorageService, acceptanceCriteriaService, timerMessageService, toaster) {
            $scope.$watch('acceptanceCriteria.finished', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                $scope.$parent.updateAcceptanceCriteriasCount();
                acceptanceCriteriaService.update($scope.acceptanceCriteria);
            });
            $scope.updateAcceptanceCriteria = function (_summary) {
                $scope.acceptanceCriteria.summary = _summary;
                var loadingInstance = timerMessageService.loading();
                acceptanceCriteriaService.update($scope.acceptanceCriteria).then(function (_acceptanceCriteria) {
                    $scope.acceptanceCriteria = _acceptanceCriteria;
                    $scope.$parent.updateAcceptanceCriteria(_acceptanceCriteria);
                    toaster.pop('info', "", "已经保存。");
                }).finally(function () {
                    timerMessageService.delayClose(loadingInstance);
                });
            };

            $scope.isShowDeleteButton = false;
            $scope.onMouseOver = function () {
                $scope.isShowDeleteButton = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isShowDeleteButton = false;
            };
            $scope.deleteAcceptanceCriteria = function () {
                var loadingInstance = timerMessageService.loading();
                acceptanceCriteriaService.delete($scope.acceptanceCriteria).then(function () {
                    $scope.$parent.deleteAcceptanceCriteria($scope.acceptanceCriteria);
                    toaster.pop('info', "", "验收标准已经删除。");
                }).finally(function () {
                    timerMessageService.delayClose(loadingInstance);
                });
            };
        }]
    };
});
