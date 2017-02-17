/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('cards', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/cards.html',
        replace: true,
        controller: ['$scope', '$routeParams', 'cardsServices', 'localStorageService', 'assignmentServices', 'timerMessageService', function ($scope, $routeParams, cardsServices, localStorageService, assignmentServices, timerMessageService) {
            $scope.loadCards = function () {
                var procedure = $scope.procedure;
                $scope.cards = procedure.cards === undefined ? [] : procedure.cards.cards;
                $scope.sortableOptions = {
                    connectWith: ".cards-sortable",
                    opacity: 0.5,
                    placeholder: "card-drag-placeholder",
                    update: function (e, ui) {
                        if (ui.item.sortable.received) {
                            return;
                        }
                        var droptargetModelCards = ui.item.sortable.droptargetModel;
                        var targetProcedure = JSON.parse(ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("procedureClone"));
                        var sourceProcedureId = ui.item.sortable.source.parent().parent().attr("procedureId");

                        if (sourceProcedureId !== targetProcedure.id && targetProcedure.wipLimit === droptargetModelCards.length) {
                            timerMessageService.message("目标工序在制品已经满额，不再接受卡片。", 'warning');
                            ui.item.sortable.cancel();
                        }
                    },
                    stop: function (e, ui) {
                        if (ui.item.sortable.droptarget === undefined) {
                            return;
                        }
                        var sourceModelCards = ui.item.sortable.sourceModel;
                        var droptargetModelCards = ui.item.sortable.droptargetModel;
                        var sourceProcedureId = ui.item.sortable.source.parent().parent().attr("procedureId");
                        var targetProcedureId = ui.item.sortable.droptarget[0].parentNode.parentNode.getAttribute("procedureId");
                        for (var index in sourceModelCards) {
                            sourceModelCards[index].sortNumber = index;
                        }
                        var cards = sourceModelCards;
                        if (sourceProcedureId !== targetProcedureId) {
                            for (var cardIndex in droptargetModelCards) {
                                droptargetModelCards[cardIndex].sortNumber = cardIndex;
                                droptargetModelCards[cardIndex].procedureId = targetProcedureId;
                            }
                        }
                        cards = cards.concat(droptargetModelCards);
                        var sortNumbersLink = JSON.parse(ui.item.sortable.source.parent().parent().attr("procedureClone")).cards._links.sortNumbers.href;
                        var loadingInstance = timerMessageService.loading();
                        cardsServices.resort(cards, sortNumbersLink).then(function () {
                        }).finally(function () {
                            timerMessageService.close(loadingInstance);
                        });
                    },
                    cancel: ".not-sortable"
                };
            };

            $scope.commentCount = 0;
            $scope.loadCards();
            $scope.closeLoading = function () {
                timerMessageService.close($scope.loadingInstance);
            };

            $scope.removeCard = function (_card) {
                var index = $scope.procedure.cards.cards.indexOf(_card);
                $scope.procedure.cards.cards.splice(index, 1);
            };
            $scope.$watch('cards', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                $scope.procedure.cardsCount = newValue.length;
            });
        }]
    };
});
