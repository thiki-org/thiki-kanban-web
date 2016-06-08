/**
 * Created by xubt on 4/29/16.
 */

//自定义指令repeatFinish
kanbanApp.directive('repeatFinish', function ($timeout) {
    return {
        restrict: 'A',

        link: function (scope, element, attr) {
            if (scope.$last == true) {
                $timeout(function () {
                    $('.entryTitle').editable();
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})


kanbanApp.directive('entryCreation', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/entry-creation.html',
        replace: true,
        controller: ['$scope', 'Entries', function ($scope, Entries) {
            $scope.createEntry = function () {
                var title = $scope.entry.title;
                var entry = {title: title}
                var entriesPromise = Entries.create(entry);
                entriesPromise.then(function (data) {
                    if ($scope.entries == null) {
                        $scope.entries = [];
                    }
                    $scope.entries.push(data);
                    $scope.entry.title = "";
                });
            };

            $scope.cancelCreateEntry = function () {
                $("#create-new-entry-form").hide();
                $("#create-new-entry-button").show();
            }
            $scope.showCreateEntryForm = function () {
                $("#create-new-entry-button").hide();
                $("#create-new-entry-form").show();
            }
        }]
    };
})


kanbanApp.directive('entry', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/entry.html',
        replace: true,
        controller: ['$scope', 'Entries', function ($scope, Entries) {
            $scope.createEntry = function () {
                var title = $scope.entry.title;
                var entry = {title: title}
                var entriesPromise = Entries.create(entry);
                entriesPromise.then(function (data) {
                    if ($scope.entries == null) {
                        $scope.entries = [];
                    }
                    $scope.entries.push(data);
                    $scope.entry.title = "";
                });
            };
        }]
    };
})
