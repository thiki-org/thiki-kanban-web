/**
 * Created by xubt on 10/18/16.
 */
kanbanApp.directive('acceptance', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/acceptanceCriteria.html',
        replace: true,
        transclude: true,
        scope: {
            acceptanceCriteria: '='
        },
        controller: ['$scope', 'localStorageService', 'acceptanceCriteriaService', 'cardsServices', function ($scope, localStorageService, acceptanceCriteriaService, cardsServices) {
            $scope.$watch('acceptanceCriteria.finished', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                acceptanceCriteriaService.update($scope.acceptanceCriteria);
            });
        }]
    };
});
