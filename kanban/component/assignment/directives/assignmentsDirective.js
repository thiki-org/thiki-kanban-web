/**
 * Created by xubt on 6/18/16.
 */
kanbanApp.directive('assignments', function() {
    return {
        restrict: 'E',
        templateUrl: 'component/assignment/partials/assignments.html',
        replace: true,
        controller: ['$scope', 'assignmentServices', 'timerMessageService', function($scope, assignmentServices, timerMessageService) {
            $scope.loadAssignments = function() {
                var thisScope = $scope;
                var assignments = $scope.card.assignmentsNode === undefined ? [] : $scope.card.assignmentsNode.assignments;

                thisScope.initAssignmentStatus();
                if ($scope.card.child !== undefined) {
                    for (var index in $scope.card.child.cards) {
                        if ($scope.card.child.cards[index] !== undefined && $scope.card.child.cards[index].assignmentsNode !== undefined) {
                            assignments = assignments.concat($scope.card.child.cards[index].assignmentsNode.assignments);
                        }
                    }
                }
                var filteredAssignments = [];
                for (var index in assignments) {
                    var isFilteredAssignmentsHasAlreadyIncluded = false;
                    for (var filteredIndex in filteredAssignments) {
                        if (filteredAssignments[filteredIndex] !== undefined && filteredAssignments[filteredIndex].assignee === assignments[index].assignee) {
                            isFilteredAssignmentsHasAlreadyIncluded = true;
                        }
                    }
                    if (!isFilteredAssignmentsHasAlreadyIncluded) {
                        filteredAssignments.push(assignments[index]);
                    }
                }
                $scope.assignments = filteredAssignments;
            };
            $scope.loadAssignments();
            $scope.$watch(function() {
                return $scope.card.child;
            }, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.loadAssignments();
            }, true);
        }]
    };
});