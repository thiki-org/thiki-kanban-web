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
            $scope.acceptanceCriteriaSaveButton = "保存";
            $scope.isShowAcceptanceCriteriaForm = false;

            $scope.updateAcceptanceCriteriasCount = function () {
                var finishedAcceptanceCriteriasCount = 0;
                for (var index in $scope.acceptanceCriterias) {
                    if ($scope.acceptanceCriterias[index].finished === true) {
                        finishedAcceptanceCriteriasCount++;
                    }
                }

                $scope.card.finishedAcceptanceCriteriasCount = finishedAcceptanceCriteriasCount;
                $scope.card.totalAcceptanceCriteriasCount = $scope.acceptanceCriterias.length;
                $scope.$parent.finishedAcceptanceCriteriasCount = finishedAcceptanceCriteriasCount;
            };

            $scope.loadAcceptanceCriterias = function () {
                var acceptanceCriterias = acceptanceCriteriaService.loadAcceptanceCriterias($scope.card._links.acceptanceCriterias.href);
                acceptanceCriterias.then(function (_acceptanceCriterias) {
                    $scope.acceptanceCriterias = _acceptanceCriterias.acceptanceCriterias;
                    $scope.$parent.acceptanceCriteriasCount = $scope.acceptanceCriterias.length;
                    $scope.updateAcceptanceCriteriasCount();
                    $scope.acceptanceCriteriasSortableOptions = {
                        connectWith: ".acceptanceCriteria",
                        placeholder: "acceptanceCriteria-drag-placeholder",
                        start: function (e, ui) {
                            console.log("staring sort.");
                        },
                        update: function (e, ui) {
                            console.log("updating sort.");
                            console.log(ui);
                        },
                        stop: function (e, ui) {
                            console.log("stopping sort.");
                            console.log(ui);

                            var acceptanceCriterias = ui.item.sortable.sourceModel;
                            for (var index in acceptanceCriterias) {
                                acceptanceCriterias[index].sortNumber = index;
                            }
                            var sortNumbersLink = _acceptanceCriterias._links.sortNumbers.href;
                            acceptanceCriteriaService.resort(acceptanceCriterias, sortNumbersLink);
                        }
                    };
                });
            };
            $scope.loadAcceptanceCriterias();
            $scope.isShowAcceptanceCriteriaCreationButton = true;
            $scope.isDisableAcceptanceCriteriaSaveButton = false;
            $scope.openAcceptanceCriteriaCreationForm = function () {
                $scope.isShowAcceptanceCriteriaForm = true;
                $scope.isShowAcceptanceCriteriaCreationButton = false;
            };

            $scope.addAcceptanceCriteriaCreation = function () {
                $scope.isShowAcceptanceCriteriaCreationButton = false;
                $scope.isDisableAcceptanceCriteriaSaveButton = true;
                $scope.acceptanceCriteriaSaveButton = "保存中..";

                var acceptanceCriteria = {summary: $scope.acceptanceCriteriaSummary};
                var acceptanceCriteriaPromise = acceptanceCriteriaService.create(acceptanceCriteria, $scope.card._links.acceptanceCriterias.href);
                acceptanceCriteriaPromise.then(function (_acceptanceCriteria) {
                    $scope.loadAcceptanceCriterias();
                    $scope.isShowAcceptanceCriteriaForm = false;
                    $scope.isShowAcceptanceCriteriaCreationButton = true;
                    $scope.acceptanceCriteriaSummary = "";
                }).finally(function () {
                    $scope.acceptanceCriteriaSaveButton = "保存";
                    $scope.isDisableAcceptanceCriteriaSaveButton = false;
                });
            };

            $scope.cancelCreateAcceptanceCriteria = function () {
                $scope.isShowAcceptanceCriteriaForm = false;
                $scope.acceptanceCriteriaSummary = "";
                $scope.isShowAcceptanceCriteriaCreationButton = true;
            }
        }]
    }
        ;
})
;


