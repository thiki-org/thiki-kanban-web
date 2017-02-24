/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('advancedFilterController', ['$scope', 'advancedFilterFactory', 'tagsService', 'localStorageService', '$uibModal', 'timerMessageService', 'projectsService',
    function($scope, advancedFilterFactory, tagsService, localStorageService, $uibModal, timerMessageService, projectsService) {
        $scope.resetFilterGroups = function() {
            $scope.isOpenAdvance = false;
            $scope.tags = undefined;
            $scope.members = undefined;
            $scope.size = { small: { point: 1, selected: false }, medium: { point: 2, selected: false }, large: { point: 3, selected: false }, Xlarge: { point: 5, selected: false }, XXlarge: { point: 8, selected: false }, unestimatable: { point: 9999, selected: false }, unestimate: { point: 0, selected: false } };
            $scope.elapsedDaysList = [
                { name: '1天内', days: 1, selected: false },
                { name: '2天内', days: 2, selected: false },
                { name: '3天内', days: 3, selected: false },
                { name: '5天内', days: 5, selected: false },
                { name: '15天内', days: 15, selected: false },
                { name: '一个月内', days: 30, selected: false }
            ];
        };
        $scope.resetFilterGroups();
        $scope.$watch(function() {
            return advancedFilterFactory.getFilter();
        }, function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            if ($scope.tags === undefined) {
                $scope.loadTags();
            }
            if ($scope.members === undefined) {
                $scope.loadMembers();
            }
            $scope.filter = advancedFilterFactory.getFilter();
            $scope.isOpenAdvance = advancedFilterFactory.getFilter().isOpenAdvanced;

            if (newValue !== oldValue) $scope.firstName = newValue;
            if (advancedFilterFactory.isSearch()) {
                var filteredCards = document.getElementsByClassName("card");
                $scope.resultCount = filteredCards.length;
            }
        }, true);
        $scope.loadTags = function() {
            if (advancedFilterFactory.getBoard() === undefined) {
                return;
            }
            tagsService.loadTagsByBoard(advancedFilterFactory.getBoard()._links.tags.href).then(function(_data) {
                $scope.tags = _data.tags;
            });
        };

        $scope.loadMembers = function() {
            if (advancedFilterFactory.getBoard()._links.members === undefined) {
                $scope.members = [];
                return;
            }
            projectsService.loadMembers(advancedFilterFactory.getBoard()._links.members.href).then(function(_data) {
                $scope.members = _data.members;
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
                advancedFilterFactory.resetFilter();
                $scope.resetFilterGroups();
                return;
            }
            $scope.isShowFilterInput = true;
            advancedFilterFactory.setBoard($scope.board);
            $scope.filterButtonText = "收起";
        };
        $scope.tagMatchType = advancedFilterFactory.getFilter().tags.tagMatchType;
        $scope.memberMatchType = advancedFilterFactory.getFilter().members.memberMatchType;

        $scope.openAdvancedFilter = function() {
            advancedFilterFactory.toggle();
        };

        $scope.selectSize = function(_sizeType) {
            _sizeType.selected = !_sizeType.selected;
            for (var index in $scope.size) {
                if ($scope.size[index].point !== _sizeType.point) {
                    $scope.size[index].selected = false;
                }
            }
            if (!_sizeType.selected) {
                advancedFilterFactory.resetSize();
                return;
            }
            advancedFilterFactory.setSize(_sizeType.point);
        };
        $scope.selectElapsedDays = function(_elapsedDays) {
            _elapsedDays.selected = !_elapsedDays.selected;
            for (var index in $scope.elapsedDaysList) {
                if ($scope.elapsedDaysList[index].days !== _elapsedDays.days) {
                    $scope.elapsedDaysList[index].selected = false;
                }
            }
            if (!_elapsedDays.selected) {
                advancedFilterFactory.resetElapsedDays();
                return;
            }
            advancedFilterFactory.setElapsedDays(_elapsedDays.days);
        };
        $scope.$watch("keyword", function(newValue, oldValue) {
            if (newValue !== oldValue) {
                advancedFilterFactory.setKeyword($scope.keyword);
            }
        }, true);
        var scrollElement = "#stages";
        $scope.isLoadAdvancedFilter = false;
        $scope.$watch(function() { return angular.element(scrollElement).is(':visible'); }, function() {
            $scope.isLoadAdvancedFilter = true;
        });
        $scope.selecteMemberMatchType = function(_memberMatchType) {
            advancedFilterFactory.setMemberMatchType(_memberMatchType);
        }
        $scope.selecteTagMatchType = function(_tagMatchType) {
            advancedFilterFactory.setTagMatchType(_tagMatchType);
        }
    }
]);