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
                var loadingInstance = timerMessageService.loading();
                cardsServices.loadCardsByProcedureId(procedure._links.cards.href).then(function (_data) {
                    timerMessageService.close(loadingInstance);
                    $scope.cards = _data.cards;
                    $scope.sortableOptions = {
                        connectWith: ".cards",
                        opacity: 0.5,
                        placeholder: "card-drag-placeholder",
                        start: function (e, ui) {
                            console.log("staring sort.");
                        },
                        update: function (e, ui) {
                            console.log("updating sort.");

                        },
                        stop: function (e, ui) {
                            console.log("stopping sort.");

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
                            var sortNumbersLink = _data._links.sortNumbers.href;
                            cardsServices.resort(cards, sortNumbersLink);
                        }
                    };
                });
            };

            $scope.mouseover = function () {
                $scope.isShowCardCreationButton = true;
            };

            $scope.commentCount = 0;
            $scope.loadCards();
            $scope.closeLoading = function () {
                timerMessageService.close($scope.loadingInstance);
            };
        }]
    };
});
