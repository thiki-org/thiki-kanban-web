/**
 * Created by xubt on 10/15/16.
 */

kanbanApp.directive('tags', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/board/tags/partials/tags.html',
        replace: true,
        transclude: true,
        scope: {
            board: '='
        },
        controller: ['$scope', 'boardsService', 'tagsService', 'localStorageService', '$location', 'timerMessageService', function ($scope, boardsService, tagsService, localStorageService, $location, timerMessageService) {
            var tagsLink = $scope.board._links.tags.href;
            $scope.colors = [
                {name: "tag-color-228EC6"},
                {name: "tag-color-30C7D4"},
                {name: "tag-color-92D6DB"},
                {name: "tag-color-28B372"},
                {name: "tag-color-98C196"},
                {name: "tag-color-C5C153"},
                {name: "tag-color-7AB2B2"},
                {name: "tag-color-FDEF76"},
                {name: "tag-color-FBE6D9"},
                {name: "tag-color-F4C6AB"},
                {name: "tag-color-F07AAF"},
                {name: "tag-color-E7235E"},
                {name: "tag-color-929396"}
            ];

            $scope.loadTags = function () {
                tagsService.loadTagsByBoard(tagsLink).then(function (_data) {
                    $scope.tags = _data.tags;
                });
            };
            $scope.loadTags();
            $scope.selectTagColor = function (_color) {
                for (var index in $scope.colors) {
                    $scope.colors[index].isSelected = false;
                }
                _color.isSelected = true;
                $scope.selectedColor = _color;
            };
            $scope.isDisableTagSaveButton = true;
            $scope.tagSaveButton = "保存";

            $scope.$watch('name', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                if ($scope.name !== undefined && $scope.name.length > 0 && $scope.selectedColor !== undefined) {
                    $scope.isDisableTagSaveButton = false;
                }
            });

            $scope.$watch('selectedColor', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                if ($scope.name !== undefined && $scope.name.length > 0 && $scope.selectedColor !== undefined) {
                    $scope.isDisableTagSaveButton = false;
                }
            });

            $scope.saveTag = function () {
                var tag = {name: $scope.name, color: $scope.selectedColor.name};
                tagsService.createTag(tag, tagsLink).then(function (_data) {
                    $scope.loadTags();
                    timerMessageService.message("标签" + tag.name + "已经创建。");
                });
            }
        }]
    };
});
