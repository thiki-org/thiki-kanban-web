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
            board: '=',
            parentCallback: '@'
        },
        controller: ['$scope', 'boardsService', 'tagsService', 'localStorageService', '$location', 'timerMessageService', 'usersService', function ($scope, boardsService, tagsService, localStorageService, $location, timerMessageService, usersService) {
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
            $scope.reset = function () {
                $scope.isShowTagCreationForm = false;
                $scope.isShowTagCreationButton = true;
                $scope.name = "";
                $scope.selectedColor = null;
                $scope.currentUpdateTag = undefined;
                $scope.isShowDeleteButton = false;
                $scope.isDisableTagsImportButton = true;
                $scope.isShowTagImportForm = false;
                for (var index in $scope.colors) {
                    $scope.colors[index].isSelected = false;
                }
            };

            $scope.loadTags = function () {
                tagsService.loadTagsByBoard(tagsLink).then(function (_data) {
                    $scope.tags = _data.tags;
                    $scope.tagsCloneLink = _data._links.clone.href;
                    $scope.callback();
                });
            };
            $scope.reset();
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

            $scope.$watch('selectedColor', function (newValue, oldValue) {
                if (oldValue === newValue) {
                    return;
                }
                if ($scope.name !== undefined && $scope.name.length > 0 && $scope.selectedColor !== undefined) {
                    $scope.isDisableTagSaveButton = false;
                }
            });
            $scope.callback = function () {
                if ($scope.$parent.parentCallback) {
                    $scope.$parent.parentCallback();
                }
            };
            $scope.saveTag = function () {
                if ($scope.currentUpdateTag !== undefined) {
                    $scope.tagSaveButton = "创建中..";
                    $scope.currentUpdateTag.name = $scope.name;
                    $scope.currentUpdateTag.color = $scope.selectedColor.name;
                    tagsService.update($scope.currentUpdateTag).then(function (_data) {
                        $scope.loadTags();
                        timerMessageService.message("标签" + $scope.currentUpdateTag.name + "已经更新。");
                        $scope.reset();
                    }).finally(function () {
                        $scope.tagSaveButton = "保存";
                    });
                    return;
                }
                $scope.tagSaveButton = "保存中..";
                var newTag = {name: $scope.name, color: $scope.selectedColor.name};
                tagsService.createTag(newTag, tagsLink).then(function (_data) {
                    $scope.loadTags();
                    timerMessageService.message("标签" + newTag.name + "已经创建。");
                    $scope.reset();
                }).finally(function () {
                    $scope.tagSaveButton = "保存";
                });
            };
            $scope.displayTagCreationForm = function () {
                $scope.isShowTagCreationForm = true;
                $scope.isShowTagCreationButton = false;
            };

            $scope.editTag = function (_tag) {
                $scope.currentUpdateTag = _tag;
                $scope.displayTagCreationForm();
                $scope.name = _tag.name;
                $scope.color = _tag.name;
                $scope.isShowDeleteButton = true;
                $scope.selectedColor = null;
                for (var index in $scope.colors) {
                    $scope.colors[index].isSelected = false;
                    if ($scope.colors[index].name === _tag.color) {
                        $scope.colors[index].isSelected = true;
                        $scope.selectedColor = $scope.colors[index];
                    }
                }
                $scope.tagDeleteButton = "删除";
            };
            $scope.deleteTag = function () {
                $scope.tagDeleteButton = "删除中..";
                tagsService.deleteTag($scope.currentUpdateTag).then(function (_data) {
                    $scope.loadTags();
                    timerMessageService.message("标签" + $scope.currentUpdateTag.name + "已经删除。");
                    $scope.reset();
                }).finally(function () {
                    $scope.tagDeleteButton = "删除";
                });
            };

            $scope.displayTagImportCreation = function () {
                $scope.tagsImportButton = "克隆";
                $scope.isShowTagImportForm = true;
                $scope.isShowTagCreationButton = false;
                $scope.selectedBoard = {};
                var boardsUrl = usersService.getCurrentUser()._links.boards.href;
                boardsService.load(boardsUrl).then(function (_data) {
                    $scope.boards = _data.boards;
                    $scope.isDisableTagsImportButton = false;
                });
            };
            $scope.$watch('boards.selected', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.selectedBoard = newValue;
                $scope.isDisableTagsImportButton = false;
            });
            $scope.importTags = function () {
                $scope.tagsImportButton = "稍等..";
                $scope.isDisableTagsImportButton = true;
                var sourceBoardId = $scope.selectedBoard.id;
                tagsService.cloneTags(sourceBoardId, $scope.tagsCloneLink).then(function (_data) {
                    $scope.loadTags();
                    timerMessageService.message("克隆成功。");
                    $scope.loadTags();
                    $scope.reset();
                }).finally(function () {
                    $scope.tagDeleteButton = "克隆";
                    $scope.isDisableTagsImportButton = false;
                });
            };
        }]
    };
});
