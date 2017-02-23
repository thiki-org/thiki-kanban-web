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
                $scope.isCardDragging = false;
                var currentScope = $scope;
                $scope.sortableOptions = {
                    connectWith: ".cards-sortable",
                    opacity: 0.5,
                    placeholder: "card-drag-placeholder",
                    start: function(e, ui) {
                        currentScope.isCardDragging = true;
                        console.log("start1" + currentScope.isCardDragging);
                        $('.cards-sortable').sortable('refresh');
                    },
                    update: function(e, ui) {

                    },
                    stop: function(e, ui) {
                        var droptarget = ui.item.sortable.droptarget;
                        if (droptarget === undefined) {

                            return;
                        }
                        if (angular.element(droptarget[0]).hasClass('child-cards')) {
                            console.log("OK");
                            var movedCard = ui.item.sortable.model;
                            var parentCard = ui.item.sortable.sourceModel[0];
                            movedCard.parentId = parentCard.id;
                            cardsServices.update(movedCard).then(function() {
                                timerMessageService.message("已将卡片" + movedCard.code + "设置为" + parentCard.code + "的从属卡片");
                            });
                            currentScope.isCardDragging = false;
                            console.log("start1" + currentScope.isCardDragging);
                            return;
                        }
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