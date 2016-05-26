/**
 * Created by xubt on 4/20/16.
 */

var entriesControllers = angular.module('entriesControllers', []);


entriesControllers.controller('EntriesCtrl', ['$scope', '$q', 'Entries', 'Tasks',
    function ($scope, $q, Entries, Tasks) {
        function loadData() {
            var entries = [];
            var tasks = [];

            var entriesPromise = Entries.load(); // 同步调用，获得承诺接口var entryTasksPromise
            var entryTasksPromise = [];
            entriesPromise.then(function (data) {  // 调用承诺API获取数据 .resolve
                angular.forEach(data.entries, function (entry) {
                    var _tasksPromise = Tasks.loadTasksByEntryId(entry._links.tasks.href);

                    _tasksPromise.then(function (data) {
                        entry.tasks = data.tasks;
                        entries.push(entry);
                    });
                    entryTasksPromise.push(_tasksPromise);
                });
                $q.all(entryTasksPromise).then(function (data) {
                    $scope.entries = entries;

                    $scope.sortableOptions = {
                        connectWith: ".tasks",
                        opacity: 0.5,
                        start: function (e, ui) {
                            //   console.log("-----------" + $(ui.item.sortable.droptarget[0]).attr("entry"));
                            //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
                        },
                        update: function (e, ui) {
                            console.log(ui.item.scope());
                            var targetEntryId = JSON.parse($(ui.item.sortable.droptarget[0]).attr("entry")).id;
                            ui.item.sortable.model.entryId = targetEntryId;
                            ui.item.sortable.model.orderNumber = ui.item.sortable.dropindex;
                            console.log(ui.item.sortable.model);

                            var _tasksPromise = Tasks.update(ui.item.sortable.model);
                            _tasksPromise.then(function (data) {
                                loadData();
                            });
                        },
                        stop: function (e, ui) {

                        }
                    };
                });
            });
        }

        loadData();
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

        $scope.showCreateTaskForm = function (entryId) {
            $("#task-create-button-" + entryId).hide();
            $("#task-create-form-" + entryId).show();
        };

        $scope.cancelCreateTask = function (entryId) {
            $("#task-create-form-" + entryId).hide();
            $("#task-create-button-" + entryId).show();
        };
        $scope.cancelCreateEntry = function () {
            $("#create-new-entry-form").hide();
            $("#create-new-entry-button").show();
        }
        $scope.showCreateEntryForm = function () {
            $("#create-new-entry-button").hide();
            $("#create-new-entry-form").show();
        }

        $scope.encode = function (str) {
            return Base64.encode(str);
        }
        $scope.createTask = function (_entryUrl, _entryTasksUrl) {
            var currentEntry = Base64.encode(_entryUrl) + "-title";
            var summary = $("#" + currentEntry).val();
            var task = {summary: summary}
            var taskPromise = Tasks.create(task, _entryTasksUrl);
            taskPromise.then(function (data) {
                loadData();
            });
        };

        $scope.updateUser = function (data) {
            alert(1);
        }
    }]);
