/**
 * Created by xubt on 10/14/16.
 */

kanbanApp.directive('cardTags', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/card/tags/partials/tags.html',
        replace: true,
        transclude: true,
        scope: {
            card: '='
        },
        controller: ['$scope', 'boardsService', 'tagsService', 'cardTagsService', '$uibModal', function ($scope, boardsService, tagsService, cardTagsService, $uibModal) {
            var tagsLink = $scope.card._links.tags.href;
            var cardTagsLink = $scope.card._links.cardTags.href;
            var boardlink;
            $scope.loadTags = function () {
                tagsService.loadTagsByBoard(tagsLink).then(function (_data) {
                    $scope.tags = _data.tags;
                    $scope.loadStickTags();
                });
            };

            $scope.loadStickTags = function () {
                cardTagsService.loadTagsByCard(cardTagsLink).then(function (_data) {
                    $scope.cardTags = _data.cardTags;
                    $scope.$parent.tagsCount = $scope.cardTags.length;
                    boardlink = _data._links.board.href;
                    for (var cardTagIndex in $scope.cardTags) {
                        for (var tagIndex in $scope.tags) {
                            if ($scope.tags[tagIndex].name === $scope.cardTags[cardTagIndex].name) {
                                $scope.tags[tagIndex].stick = true;
                            }
                        }
                    }
                });
            };

            $scope.loadTags();

            $scope.stickTags = function (_tag) {
                _tag.stick = !_tag.stick;
                var stickTags = [];
                for (var tagIndex in $scope.tags) {
                    if ($scope.tags[tagIndex].stick) {
                        var tag = {tagId: $scope.tags[tagIndex].id};
                        stickTags.push(tag);
                    }
                }
                cardTagsService.stickTags(stickTags, cardTagsLink).then(function (_data) {
                    $scope.card.tags.tags = _data.cardTags;
                    $scope.$parent.card.tags = _data.cardTags;
                    $scope.$parent.tagsCount = stickTags.length;
                });
            };

            $scope.openBoardTags = function () {
                var currentScope = $scope;
                boardsService.loadBoardByLink(boardlink)
                    .then(function (_data) {
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'component/procedure/partials/tags-configuration.html',
                            controller: ['$scope', 'teamsService', 'timerMessageService', '$location', '$uibModalInstance',
                                function ($scope) {
                                    $scope.board = _data;
                                    $scope.parentCallback = currentScope.loadStickTags;
                                }],
                            size: 'mid',
                            backdrop: "static"
                        });
                    });
            };
        }]
    };
});
