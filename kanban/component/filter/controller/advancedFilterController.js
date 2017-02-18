/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('advancedFilterController', ['$scope', 'advancedFilterFactory', 'tagsService', 'localStorageService', '$uibModal', 'timerMessageService',
    function($scope, advancedFilterFactory, tagsService, localStorageService, $uibModal, timerMessageService) {
        $scope.isOpenAdvance = false;
        $scope.$watch(function() {
            return advancedFilterFactory.getFilter();
        }, function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            if ($scope.tags === undefined) {
                $scope.loadTags();
            }
            $scope.filter = advancedFilterFactory.getFilter();
            console.log(advancedFilterFactory.getFilter());
            $scope.isOpenAdvance = advancedFilterFactory.getFilter().isOpenAdvanced;

            if (newValue !== oldValue) $scope.firstName = newValue;
        }, true);
        $scope.loadTags = function() {
            if (advancedFilterFactory.getBoard() === undefined) {
                return;
            }
            tagsService.loadTagsByBoard(advancedFilterFactory.getBoard()._links.tags.href).then(function(_data) {
                $scope.tags = _data.tags;
            });
        };
        $scope.selectTag = function(_tag) {
            advancedFilterFactory.addTag(_tag);
            _tag.stick = !_tag.stick;
        };
        $scope.isShowFilterInput = false;
        $scope.filterButtonText = "过滤";
        $scope.disPlayFilterInput = function() {
            if ($scope.isShowFilterInput) {
                $scope.isShowFilterInput = false;
                $scope.filterButtonText = "过滤";
                advancedFilterFactory.closeAdvanced();
                return;
            }
            $scope.isShowFilterInput = true;
            advancedFilterFactory.setBoard($scope.board);
            $scope.filterButtonText = "收起";
        };
        $scope.tagMatchType = advancedFilterFactory.getFilter().tags.tagMatchType;
        $scope.openAdvancedFilter = function() {
            advancedFilterFactory.toggle();
        };
        $scope.$watch("keyword", function(newValue, oldValue) {
            if (newValue !== oldValue) {
                advancedFilterFactory.setKeyword($scope.keyword);
            }
        }, true);
        $scope.$watch("tagMatchType", function(newValue, oldValue) {
            if (newValue !== oldValue) {
                advancedFilterFactory.setTagMatchType($scope.tagMatchType);
            }
        }, true);
    }
]);