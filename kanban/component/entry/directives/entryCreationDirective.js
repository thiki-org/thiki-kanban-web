/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('entryCreation', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/entry/partials/entry-creation.html',
        replace: true,
        scope: true,
        controller: ['$scope', 'entriesServices', function ($scope, entriesServices) {
            $scope.createEntry = function () {
                var title = $scope.title;
                var entry = {title: title, boardId: $scope.board.id};
                var entriesPromise = entriesServices.create(entry);
                entriesPromise.then(function (data) {
                    if ($scope.entries === null) {
                        $scope.entries = [];
                    }
                    $scope.entries.push(data);
                    $scope.title = "";
                    $scope.cancelCreateEntry();
                });
            };

            $scope.displayCreationButton = true;
            $scope.displayForm = false;
            $scope.cancelCreateEntry = function () {
                $scope.displayCreationButton = true;
                $scope.displayForm = false;
            };
            $scope.showCreateEntryForm = function () {
                $scope.displayCreationButton = false;
                $scope.displayForm = true;
            };
            $scope.keyPress = function ($event) {
                if ($event.keyCode == 13) {
                    $scope.createEntry();
                }
                if ($event.keyCode == 27) {
                    $scope.cancelCreateEntry();
                }
            };
            $scope.blur = function () {
                if ($scope.title === "" || $scope.title === undefined) {
                    $scope.cancelCreateEntry();
                }
            };
            $scope.updateEntry = function (_title, _entry) {
                var entry = _entry;
                if (entry.title === "") {
                    return;
                }
                entry.title = _title;
                var entryPromise = entriesServices.update(entry);
                entryPromise.then(function () {
                });
            };

        }]
    };
});
