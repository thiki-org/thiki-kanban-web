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

            $scope.initAcceptanceCriterias = function () {
                $scope.acceptanceCriterias = $filter('orderBy')($scope.acceptanceCriterias, 'sortNumber');
                $scope.$parent.acceptanceCriteriasCount = $scope.acceptanceCriterias.length;
                $scope.updateAcceptanceCriteriasCount();
                var currentScope = $scope;
                $scope.acceptanceCriteriasSortableOptions = {
                    connectWith: ".acceptanceCriteria",
                    opacity: 0.5,
                    placeholder: "acceptanceCriteria-drag-placeholder",
                    containerPositioning: 'relative',
                    stop: function (e, ui) {
                        var loadingInstance = timerMessageService.loading();
                        var acceptanceCriterias = ui.item.sortable.sourceModel;
                        for (var index in acceptanceCriterias) {
                            acceptanceCriterias[index].sortNumber = index;
                        }
                        var movementLink = currentScope.card.acceptanceCriteriasNode._links.movement.href;
                        acceptanceCriteriaService.move(acceptanceCriterias, movementLink).then(function (_acceptanceCriterias) {
                            timerMessageService.close(loadingInstance);
                        });
                    }
                };
            };
            $scope.loadAcceptanceCriterias = function () {
                if ($scope.card.acceptanceCriteriasNode !== undefined) {
                    $scope.acceptanceCriterias = $scope.card.acceptanceCriteriasNode === undefined ? [] : $scope.card.acceptanceCriteriasNode.acceptanceCriterias;
                    $scope.initAcceptanceCriterias();
                    return;
                }
                acceptanceCriteriaService.loadAcceptanceCriterias($scope.card._links.acceptanceCriterias.href).then(function (_acceptanceCriterias) {
                    $scope.acceptanceCriterias = _acceptanceCriterias.acceptanceCriterias;
                    $scope.initAcceptanceCriterias();
                });
            };
            $scope.loadAcceptanceCriterias();
            $scope.isShowAcceptanceCriteriaCreationButton = true;
            $scope.isDisableAcceptanceCriteriaSaveButton = false;
            $scope.openAcceptanceCriteriaCreationForm = function () {
                $scope.isShowAcceptanceCriteriaForm = true;
                $scope.isShowAcceptanceCriteriaCreationButton = false;
            };
            $scope.acceptanceCriteria = {summary: ""};
            $scope.addAcceptanceCriteriaCreation = function () {
                var loadingInstance = timerMessageService.loading();
                $scope.isShowAcceptanceCriteriaCreationButton = false;
                $scope.isDisableAcceptanceCriteriaSaveButton = true;

                $scope.acceptanceCriteriaSaveButton = "保存中..";
                var acceptanceCriteria = {summary: $scope.acceptanceCriteria.summary};
                acceptanceCriteriaService.create(acceptanceCriteria, $scope.card._links.acceptanceCriterias.href)
                    .then(function (_acceptanceCriteria) {
                        $scope.acceptanceCriterias.push(_acceptanceCriteria);
                        $scope.card.acceptanceCriteriasNode = $scope.card.acceptanceCriteriasNode === undefined ? {acceptanceCriterias: []} : $scope.card.acceptanceCriteriasNode;
                        $scope.card.acceptanceCriteriasNode.acceptanceCriterias = $scope.acceptanceCriterias;
                        $scope.card.totalAcceptanceCriteriasCount = $scope.acceptanceCriterias.length;
                        $scope.isShowAcceptanceCriteriaForm = false;
                        $scope.isShowAcceptanceCriteriaCreationButton = true;
                        $scope.acceptanceCriteria.summary = "";
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