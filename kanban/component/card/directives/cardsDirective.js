/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('cards', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/cards.html',
        replace: true,
        controller: ['$scope', '$routeParams', 'cardsServices', 'localStorageService', 'assignmentServices', 'timerMessageService', 'advancedFilterFactory', '$rootScope', function ($scope, $routeParams, cardsServices, localStorageService, assignmentServices, timerMessageService, advancedFilterFactory, $rootScope) {
            $scope.loadCards = function () {
                var stage = $scope.stage;
                $scope.cards = stage.cardsNode === undefined ? [] : stage.cardsNode.cards;
                $scope.isCardDragging = false;
                var currentScope = $scope;
                $scope.sortableOptions = {
                    connectWith: ".cards-sortable",
                    opacity: 0.5,
                    placeholder: "card-drag-placeholder",
                    start: function (e, ui) {
                        if (ui.item.sortable.model.child === undefined) {
                            localStorageService.set("isCardDragging", true);
                        }
                        $('.cards-sortable').sortable('refresh');
                    },
                    update: function (e, ui) {
                        if (ui.item.sortable.received) {
                            return;
                        }
                        var targetStage = JSON.parse(ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("stageClone"));

                        var droptargetModelCards = ui.item.sortable.droptargetModel;
                        var sourceStageId = ui.item.sortable.source.parent().parent().attr("stageId");

                        if (targetStage !== null && sourceStageId !== targetStage.id && targetStage.wipLimit === droptargetModelCards.length) {
                            timerMessageService.message("目标环节在制品已经满额，不再接受卡片。", 'warning');
                            ui.item.sortable.cancel();
                        }
                        var movedCard = ui.item.sortable.sourceModel[ui.item.sortable.index];
                        //Moving to doneStage
                        if (targetStage !== null && targetStage.inDoneStatus) {
                            if (movedCard.acceptanceCriteriasNode !== undefined) {
                                for (var index in movedCard.acceptanceCriteriasNode.acceptanceCriterias) {
                                    if (!movedCard.acceptanceCriteriasNode.acceptanceCriterias[index].finished) {
                                        timerMessageService.message("当前卡片有验收标准尚未完成，不允许进入完成环节。", 'warning');
                                        ui.item.sortable.cancel();
                                        return;
                                    }
                                }
                            }
                        }
                        if (angular.element(ui.item.sortable.droptarget[0]).hasClass('child-cards')) {
                            if (movedCard.child !== undefined) {
                                timerMessageService.message("该卡片具有从属卡片，不允许挪到到其他卡片。", 'warning');
                                ui.item.sortable.cancel();
                                ui.item.sortable.isMoveToParent = true;
                                return;
                            }
                            var parentId = ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("card-id");
                            movedCard.parentId = parentId;
                            cardsServices.update(movedCard).then(function () {
                                timerMessageService.message("已将卡片" + movedCard.code + "设置为从属卡片。");
                            });
                            ui.item.sortable.isMoveToParent = true;
                        }
                    },
                    stop: function (e, ui) {
                        localStorageService.set("isCardDragging", false);
                        $('.cards-sortable').sortable('refresh');
                        var droptarget = ui.item.sortable.droptarget;
                        if (droptarget !== undefined && !ui.item.sortable.isMoveToParent) {
                            var sourceModelCards = ui.item.sortable.sourceModel;
                            var droptargetModelCards = ui.item.sortable.droptargetModel;
                            var sourceStageId = ui.item.sortable.source.parent().parent().attr("stageId");
                            var targetStageId = ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("stageId");
                            for (var index in sourceModelCards) {
                                sourceModelCards[index].sortNumber = index;
                            }
                            if (sourceStageId !== targetStageId) {
                                for (var cardIndex in droptargetModelCards) {
                                    droptargetModelCards[cardIndex].sortNumber = cardIndex;
                                    droptargetModelCards[cardIndex].stageId = targetStageId;
                                }
                            }
                            var cards = sourceModelCards;
                            cards = cards.concat(droptargetModelCards);
                            var sortNumbersLink = JSON.parse(ui.item.sortable.droptarget.parent().parent().attr("stageClone")).cardsNode._links.sortNumbers.href;
                            var loadingInstance = timerMessageService.loading();
                            cardsServices.resort(cards, sortNumbersLink).then(function () {
                            }).finally(function () {
                                timerMessageService.close(loadingInstance);
                            });
                        }
                    },
                    cancel: ".not-sortable"
                };
            };

            $scope.commentCount = 0;
            $scope.loadCards();
            $scope.closeLoading = function () {
                timerMessageService.close($scope.loadingInstance);
            };
            $scope.$watch('cards', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                $scope.stage.cardsCount = newValue.length;
            });

            $scope.$watch(function () {
                return advancedFilterFactory.getFilter();
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.filter = advancedFilterFactory.getFilter();
            }, true);
            $scope.$watch(function () {
                return localStorageService.get("isCardDragging");
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.isCardDragging = localStorageService.get("isCardDragging");
            }, true);
        }]
    };
});