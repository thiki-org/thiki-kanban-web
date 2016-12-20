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
            $scope.card.tags = $scope.card.tags.tags;
        }]
    };
});
