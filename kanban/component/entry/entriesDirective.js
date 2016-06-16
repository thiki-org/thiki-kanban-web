/**
 * Created by xubt on 4/29/16.
 */
kanbanApp.directive('entryCreation', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'component/entry/partials/entry-creation.html',
        replace: true,
        scope: true,
        controller: ['$scope', 'entriesServices', function ($scope, entriesServices) {
            $scope.createEntry = function () {
                var title = $scope.entry.title;
                var entry = {title: title, boardId: $scope.board.id};
                var entriesPromise = entriesServices.create(entry);
                entriesPromise.then(function (data) {
                    if ($scope.entries == null) {
                        $scope.entries = [];
                    }
                    $scope.entries.push(data);
                    $scope.entry.title = "";
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
        controller: ['$scope', '$routeParams', 'boardsService', 'entriesServices', 'tasksServices', function ($scope, $routeParams, boardsService, entriesServices, tasksServices) {
            $scope.loadEntries = function () {
                var boardLink = $routeParams.boardLink;

                var boardPromise = boardsService.loadBoardByLink(boardLink);
                boardPromise.then(function (_board) {
                    $scope.board = _board;
                    entriesServices.entriesLink = _board._links.entries.href;
                    var entriesPromise = entriesServices.load(_board._links.entries.href);
                    entriesPromise.then(function (data) {
                            $scope.entries = data;

                            $scope.sortableOptions = {
                                connectWith: ".tasks",
                                opacity: 0.5,
                                start: function (e, ui) {
                                    //   console.log("-----------" + $(ui.item.sortable.droptarget[0]).attr("entry"));
                                    //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
                                },
                                update: function (e, ui) {

                                },
                                stop: function (e, ui) {
                                    var targetEntryId = $(ui.item.sortable.droptarget[0]).parent().attr("entryId");
                                    ui.item.sortable.model.entryId = targetEntryId;
                                    ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                                    var _tasksPromise = tasksServices.update(ui.item.sortable.model);
                                    _tasksPromise.then(function (data) {
                                        // loadEntries();
                                        var boardLink = $routeParams.boardLink;

                                        var boardPromise = boardsService.loadBoardByLink(boardLink);
                                        boardPromise.then(function (_board) {
                                            $scope.board = _board;
                                        });
                                    });
                                }
                            };
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
        controller: ['$scope', '$routeParams', 'boardsService', 'entriesServices', function ($scope, $routeParams, boardsService, entriesServices) {
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
