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
                    if ($scope.entries == null) {
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
                if ($scope.title === "" || $scope.title == undefined) {
                    $scope.cancelCreateEntry();
                }
            };
            $scope.updateEntry = function (_title, _entry) {
                var entry = _entry;
                entry.title = _title;
                var entryPromise = entriesServices.update(entry);
                entryPromise.then(function () {
                });
            };

        }]
    };
});

kanbanApp.directive('entries', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/entry/partials/entries.html',
        replace: true,
        scope: true,
        controller: ['$scope', 'boardsService', 'entriesServices', 'localStorageService', function ($scope, boardsService, entriesServices, localStorageService) {
            $scope.loadEntries = function () {
                var boardLink = localStorageService.get("boardLink");
                var boardPromise = boardsService.loadBoardByLink(boardLink);
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    entriesServices.entriesLink = _board._links.entries.href;
                    var entriesPromise = entriesServices.load(_board._links.entries.href);
                    entriesPromise.then(function (data) {
                            $scope.entries = data;
                        }
                    );
                });
            };
            $scope.loadEntries();
        }]
    };
});

kanbanApp.directive('entry', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/entry/partials/entry.html',
        replace: true,
        transclude: true,
        scope: {
            entry: '='
        },
        controller: ['$scope', 'boardsService', 'entriesServices', function ($scope, boardsService, entriesServices) {
            $scope.displayEntryMenu = false;
            $scope.onEntryMenuMouseOver = function () {
                $scope.displayEntryMenu = true;
            };
            $scope.onEntryMenuMouseLeave = function () {
                $scope.displayEntryMenu = false;
            };

            var currentScope = $scope;
            $scope.openModal = function (_message, _link) {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要删除" + _message + "吗?";
                        $scope.ok = function () {
                            var _entryDeletePromise = entriesServices.deleteByLink(_link);
                            _entryDeletePromise.then(function () {
                                currentScope.$parent.loadEntries();
                            });
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };
        }]
    };
});