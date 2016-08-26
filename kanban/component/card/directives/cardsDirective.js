/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('cards', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/card/partials/cards.html',
        replace: true,
        controller: ['$scope', '$routeParams', 'cardsServices', 'localStorageService', 'assignmentServices', function ($scope, $routeParams, cardsServices, localStorageService, assignmentServices) {
            $scope.loadCards = function () {
                var procedure = $scope.procedure;
                var _cardsPromise = cardsServices.loadCardsByProcedureId(procedure._links.cards.href);

                _cardsPromise.then(function (data) {
                    $scope.cards = data;
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
                            var targetProcedureId = $(ui.item.sortable.droptarget[0]).parent().attr("procedureId");
                            if (targetProcedureId == ui.item.sortable.model.procedureId) {
                                return;
                            }
                            ui.item.sortable.model.procedureId = targetProcedureId;
                            ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                            var _cardsPromise = cardsServices.update(ui.item.sortable.model);
                            _cardsPromise.then(function (data) {

                            });
                        }
                    };
                });
            };

            $scope.mouseover = function () {
                $scope.isShowCardCreationButton = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isShowCardCreationButton = false;
            };

            $scope.loadCards();
        }]
    };
});
