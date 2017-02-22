/**
 * Created by xubt on 10/14/16.
 */

kanbanApp.directive('cardTagsSmall', function() {
    return {
        restrict: 'E',
        templateUrl: 'component/card/tags/partials/tags-small.html',
        replace: true,
        controller: ['$scope', 'boardsService', 'tagsService', 'cardTagsService', function($scope, boardsService, tagsService, cardTagsService) {
            $scope.tags = $scope.card.tagsNode === undefined ? [] : $scope.card.tagsNode.cardTags;
        }]
    };
});