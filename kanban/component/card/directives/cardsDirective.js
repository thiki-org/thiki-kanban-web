/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('cards', function($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/cards.html',
        replace: true,
        controller: ['$scope', '$routeParams', 'cardsServices', 'localStorageService', 'assignmentServices', 'timerMessageService', 'advancedFilterFactory', function($scope, $routeParams, cardsServices, localStorageService, assignmentServices, timerMessageService, advancedFilterFactory) {
            $scope.loadCards = function() {
                var stage = $scope.stage;
                $scope.cards = stage.cardsNode === undefined ? [] : stage.cardsNode.cards;
                $scope.sortableOptions = {
                    connectWith: ".cards-sortable",
                    opacity: 0.5,
                    placeholder: "card-drag-placeholder",
                    update: function(e, ui) {
                        if (ui.item.sortable.received) {
                            return;
                        }
                        var droptargetModelCards = ui.item.sortable.droptargetModel;
                        var targetStage = JSON.parse(ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("stageClone"));
                        var sourceStageId = ui.item.sortable.source.parent().parent().attr("stageId");

                        if (sourceStageId !== targetStage.id && targetStage.wipLimit === droptargetModelCards.length) {
                            timerMessageService.message("目标环节在制品已经满额，不再接受卡片。", 'warning');
                            ui.item.sortable.cancel();
                        }
                    },
                    stop: function(e, ui) {
                        if (ui.item.sortable.droptarget === undefined) {
                            return;
                        }
                        var sourceModelCards = ui.item.sortable.sourceModel;
                        var droptargetModelCards = ui.item.sortable.droptargetModel;
                        var sourceStageId = ui.item.sortable.source.parent().parent().attr("stageId");
                        var targetStageId = ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("stageId");
                        for (var index in sourceModelCards) {
                            sourceModelCards[index].sortNumber = index;
                        }
                        var cards = sourceModelCards;
                        if (sourceStageId !== targetStageId) {
                            for (var cardIndex in droptargetModelCards) {
                                droptargetModelCards[cardIndex].sortNumber = cardIndex;
                                droptargetModelCards[cardIndex].stageId = targetStageId;
                            }
                        }
                        cards = cards.concat(droptargetModelCards);
                        var sortNumbersLink = JSON.parse(ui.item.sortable.source.parent().parent().attr("stageClone")).cards._links.sortNumbers.href;
                        var loadingInstance = timerMessageService.loading();
                        cardsServices.resort(cards, sortNumbersLink).then(function() {}).finally(function() {
                            timerMessageService.close(loadingInstance);
                        });
                    },
                    cancel: ".not-sortable"
                };
            };

            $scope.commentCount = 0;
            $scope.loadCards();
            $scope.closeLoading = function() {
                timerMessageService.close($scope.loadingInstance);
            };

            $scope.removeCard = function(_card) {
                var index = $scope.stage.cardsNode.cards.indexOf(_card);
                $scope.stage.cardsNode.cards.splice(index, 1);
            };
            $scope.$watch('cards', function(newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                $scope.stage.cardsCount = newValue.length;
            });

            $scope.$watch(function() {
                return advancedFilterFactory.getFilter();
            }, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.filter = advancedFilterFactory.getFilter();
            }, true);
        }]
    };
});