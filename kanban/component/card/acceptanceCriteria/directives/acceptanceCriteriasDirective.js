/**
 * Created by xubt on 10/18/16.
 */
kanbanApp.directive('acceptanceCriterias', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/acceptanceCriteria/partials/acceptanceCriterias.html',
        replace: true,
        transclude: true,
        scope: {
            card: '=',
            stage: '='
        },
        controller: ['$scope', 'localStorageService', 'acceptanceCriteriaService', 'timerMessageService', '$filter', 'jsonService', 'toaster', function ($scope, localStorageService, acceptanceCriteriaService, timerMessageService, $filter, jsonService, toaster) {
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
                $scope.$parent.acceptanceCriteriasCount = $scope.acceptanceCriterias.length;
                $scope.card.finished = $scope.$parent.finishedAcceptanceCriteriasCount === $scope.acceptanceCriterias.length;
            };

            $scope.updateAcceptanceCriteria = function (__acceptanceCriteria) {
                for (var index in $scope.acceptanceCriterias) {
                    if ($scope.acceptanceCriterias[index].id === __acceptanceCriteria.id) {
                        $scope.acceptanceCriterias[index] = __acceptanceCriteria;
                        $scope.card.acceptanceCriteriasNode.acceptanceCriterias = $scope.acceptanceCriterias;
                        return;
                    }
                }
            };

            $scope.deleteAcceptanceCriteria = function (__acceptanceCriteria) {
                var index = jsonService.indexOf($scope.card.acceptanceCriteriasNode.acceptanceCriterias, "id", __acceptanceCriteria.id);
                $scope.card.acceptanceCriteriasNode.acceptanceCriterias.splice(index, 1);
                $scope.acceptanceCriterias.splice(index, 1);
                $scope.updateAcceptanceCriteriasCount();
            };

            $scope.loadAcceptanceCriterias = function () {
                $scope.acceptanceCriterias = $scope.card.acceptanceCriteriasNode === undefined ? [] : $scope.card.acceptanceCriteriasNode.acceptanceCriterias;
                $scope.acceptanceCriterias = $filter('orderBy')($scope.acceptanceCriterias, 'sortNumber');
                $scope.$parent.acceptanceCriteriasCount = $scope.acceptanceCriterias.length;
                $scope.updateAcceptanceCriteriasCount();
                var currentScope = $scope;
                $scope.acceptanceCriteriasSortableOptions = {
                    connectWith: ".acceptanceCriteria",
                    placeholder: "acceptanceCriteria-drag-placeholder",
                    'ui-floating': 'auto',
                    stop: function (e, ui) {
                        var loadingInstance = timerMessageService.loading();
                        var acceptanceCriterias = ui.item.sortable.sourceModel;
                        for (var index in acceptanceCriterias) {
                            acceptanceCriterias[index].sortNumber = index;
                        }
                        var sortNumbersLink = currentScope.card.acceptanceCriteriasNode._links.sortNumbers.href;
                        acceptanceCriteriaService.resort(acceptanceCriterias, sortNumbersLink).then(function (_acceptanceCriterias) {
                            timerMessageService.close(loadingInstance);
                        });
                    }
                };
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
                var loadingInstance = timerMessageService.loading();
                acceptanceCriteriaService.create(acceptanceCriteria, $scope.card._links.acceptanceCriterias.href)
                    .then(function (_acceptanceCriteria) {
                        $scope.acceptanceCriterias.push(_acceptanceCriteria);
                        $scope.card.acceptanceCriteriasNode = $scope.card.acceptanceCriteriasNode === undefined ? {acceptanceCriterias: []} : $scope.card.acceptanceCriteriasNode;
                        $scope.card.acceptanceCriteriasNode.acceptanceCriterias = $scope.acceptanceCriterias;
                        $scope.card.totalAcceptanceCriteriasCount = $scope.acceptanceCriterias.length;
                        $scope.isShowAcceptanceCriteriaForm = false;
                        $scope.isShowAcceptanceCriteriaCreationButton = true;
                        $scope.acceptanceCriteriaSummary = "";
                        $scope.updateAcceptanceCriteriasCount();
                        toaster.pop('info', "", "新的验收标准创建成功。");
                    }).finally(function () {
                    $scope.acceptanceCriteriaSaveButton = "保存";
                    $scope.isDisableAcceptanceCriteriaSaveButton = false;
                    timerMessageService.delayClose(loadingInstance);
                });
            };

            $scope.cancelCreateAcceptanceCriteria = function () {
                $scope.isShowAcceptanceCriteriaForm = false;
                $scope.acceptanceCriteriaSummary = "";
                $scope.isShowAcceptanceCriteriaCreationButton = true;
            };

            $scope.$watch('card.finishedAcceptanceCriteriasCount', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                if (newValue > 0 && $scope.acceptanceCriterias.length === newValue) {
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'component/card/acceptanceCriteria/partials/acceptance-criterias-finished-dialog.html',
                        controller: [
                            '$scope',
                            '$uibModalInstance', '$interval',
                            function ($scope, $uibModalInstance, $interval) {
                                $scope.timerMessage = "3秒后自动关闭";
                                var count = 2;
                                $scope.timer = $interval(function () {
                                    if (count === 0) {
                                        $interval.cancel($scope.timer);
                                        $uibModalInstance.dismiss('cancel');
                                    } else {
                                        $scope.timerMessage = count + "秒后自动关闭";
                                    }
                                    count--;
                                }, 1000);
                            }
                        ],
                        size: 'ac',
                        backdrop: "static"
                    });
                }
            });
            $scope.$watch(function () {
                return $scope.$parent.finishedAcceptanceCriteriasCount;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.card.finished = $scope.$parent.finishedAcceptanceCriteriasCount === $scope.acceptanceCriterias.length;
            }, true);
        }]
    };
});