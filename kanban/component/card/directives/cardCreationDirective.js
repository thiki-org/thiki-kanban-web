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
            $scope.cardCreationButtonText = "创建";
            $scope.isDisableCardCreationButton = false;
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
                $scope.cardCreationButtonText = "稍等..";
                $scope.isDisableCardCreationButton = true;
                var card = {summary: $scope.summary, procedureId: procedure.id};
                cardsServices.create(card, procedure._links.cards.href).then(function (_card) {
                    $scope.cards.push(_card);
                }).finally(function () {
                    $scope.cardCreationButtonText = "创建";
                    $scope.isDisableCardCreationButton = false;
                    $scope.cancelCreateCard();
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

