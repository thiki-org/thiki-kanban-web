/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.directive('cardCreation', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'component/card/partials/card-creation.html',
        controller: ['$scope', 'cardsServices', 'jsonService', function ($scope, cardsServices, jsonService) {
            var stage = $scope.stage;
            $scope.displayCreationButton = true;
            $scope.displayForm = false;
            $scope.cardCreationButtonText = "创建";
            $scope.isDisableCardCreationButton = false;
            $scope.sizeList = [
                {id: 1, name: "S"},
                {id: 2, name: "M"},
                {id: 3, name: "L"},
                {id: 5, name: "XL"},
                {id: 8, name: "XXL"},
                {id: 9999, name: "不可估算"}
            ];
            $scope.sizeList.selected = jsonService.findById($scope.sizeList, $scope.card.size);
            $scope.showCreateCardForm = function () {
                $scope.displayCreationButton = false;
                $scope.displayForm = true;
                $scope.summary = "";
            };
            $scope.cancelCreateCard = function () {
                $scope.stage.isShowCardCreation = false;
                $scope.summary = "";
            };
            $scope.createCard = function () {
                if ($scope.summary === "") {
                    return;
                }
                $scope.cardCreationButtonText = "稍等..";
                $scope.isDisableCardCreationButton = true;
                var card = {summary: $scope.summary, stageId: stage.id};
                cardsServices.create(card, stage._links.cards.href).then(function (_card) {
                    _card.isNew = true;
                    $scope.cards.push(_card);
                    var newCardElement = angular.element(document.getElementById("card-" + _card.id));
                    newCardElement.removeClass('new-card');
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

