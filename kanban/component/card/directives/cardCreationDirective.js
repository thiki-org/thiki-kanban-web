/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('cardCreation', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'component/card/partials/card-creation.html',
        controller: ['$scope', 'cardsServices', function ($scope, cardsServices) {
            var procedure = $scope.procedure;
            $scope.displayCreationButton = true;
            $scope.displayForm = false;
            $scope.showCreateCardForm = function () {
                $scope.displayCreationButton = false;
                $scope.displayForm = true;
                $scope.summary = "";
            };
            $scope.cancelCreateCard = function () {
                $scope.displayCreationButton = true;
                $scope.displayForm = false;
            };
            $scope.createCard = function () {
                if ($scope.summary === "") {
                    return;
                }
                var card = {summary: $scope.summary, procedureId: procedure.id};
                var cardPromise = cardsServices.create(card, procedure._links.cards.href);
                cardPromise.then(function (data) {
                    var _cardsPromise = cardsServices.loadCardsByProcedureId(procedure._links.cards.href);

                    _cardsPromise.then(function (data) {
                        $scope.cards = data.cards;
                        $scope.displayCreationButton = true;
                        $scope.displayForm = false;
                    });
                });
            };
            $scope.keyPress = function ($event) {
                if ($event.keyCode == 13) {
                    $scope.createCard();
                }
                if ($event.keyCode == 27) {
                    $scope.cancelCreateCard();
                }
            };
            $scope.blur = function () {
                if ($scope.summary === "") {
                    $scope.displayCreationButton = true;
                    $scope.displayForm = false;
                }
            };
        }]
    };
});

