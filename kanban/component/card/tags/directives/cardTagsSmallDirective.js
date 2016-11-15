/**
 * Created by xubt on 10/14/16.
 */

kanbanApp.directive('cardTagsSmall', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/tags/partials/tags-small.html',
        replace: true,
        transclude: true,
        scope: {
            card: '='
        },
        controller: ['$scope', 'boardsService', 'tagsService', 'cardTagsService', function ($scope, boardsService, tagsService, cardTagsService) {
            var cardTagsLink = $scope.card._links.cardTags.href;
            $scope.loadStickTags = function () {
                cardTagsService.loadTagsByCard(cardTagsLink).then(function (_data) {
                    $scope.card.tags = _data.cardTags;
                });
            };
            $scope.loadStickTags();
        }]
    };
});
