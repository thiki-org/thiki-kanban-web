/**
 * Created by xubt on 10/18/16.
 */
kanbanApp.directive('acceptanceCriterias', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/acceptanceCriterias.html',
        replace: true,
        transclude: true,
        scope: {
            card: '='
        },
        controller: ['$scope', 'localStorageService', 'acceptanceCriteriaService', 'cardsServices', function ($scope, localStorageService, acceptanceCriteriaService, cardsServices) {
            $scope.acceptanceCriteriaSaveButton = "新建验收标准";
            $scope.isShowAcceptanceCriteriaForm = false;
            var acceptanceCriterias = acceptanceCriteriaService.loadAcceptanceCriterias($scope.card._links.acceptanceCriterias.href);
            acceptanceCriterias.then(function (_acceptanceCriterias) {
                $scope.acceptanceCriterias = _acceptanceCriterias.acceptanceCriterias;
            });
            $scope.createAcceptanceCriteria = function () {
                if ($scope.isShowAcceptanceCriteriaForm == false) {
                    $scope.isShowAcceptanceCriteriaForm = true;
                }
                var acceptanceCriteria = {summary: $scope.acceptanceCriteriaSummary};
                var acceptanceCriteriaPromise = acceptanceCriteriaService.create(acceptanceCriteria, $scope.card._links.acceptanceCriterias.href);
                acceptanceCriteriaPromise.then(function (_acceptanceCriteria) {
                    $scope.acceptanceCriterias.push(_acceptanceCriteria);
                    $scope.isShowAcceptanceCriteriaForm = false;
                });
            };
            $scope.cancelCreateAcceptanceCriteria = function () {
                $scope.isShowAcceptanceCriteriaForm = false;
                $scope.acceptanceCriteriaSummary = "";
            }
        }]
    };
});


