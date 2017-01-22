/**
 * Created by xubt on 10/18/16.
 */
kanbanApp.directive('acceptanceCriteria', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/acceptanceCriteria.html',
        replace: true,
        transclude: true,
        scope: {
            acceptanceCriteria: '=',
            procedure: '='
        },
        controller: ['$scope', 'localStorageService', 'acceptanceCriteriaService', 'cardsServices', function ($scope, localStorageService, acceptanceCriteriaService, cardsServices) {
            $scope.$watch('acceptanceCriteria.finished', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                $scope.$parent.updateAcceptanceCriteriasCount();
                acceptanceCriteriaService.update($scope.acceptanceCriteria);
            });
            $scope.updateAcceptanceCriteria = function (_summary) {
                $scope.acceptanceCriteria.summary = _summary;
                acceptanceCriteriaService.update($scope.acceptanceCriteria).then(function (_acceptanceCriteria) {
                    $scope.acceptanceCriteria = _acceptanceCriteria;
                    $scope.$parent.updateAcceptanceCriteria(_acceptanceCriteria);
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
                var acceptanceCriteriaPromise = acceptanceCriteriaService.delete($scope.acceptanceCriteria);
                acceptanceCriteriaPromise.then(function () {
                    $scope.$parent.loadAcceptanceCriterias();
                });
            };
        }]
    };
});
