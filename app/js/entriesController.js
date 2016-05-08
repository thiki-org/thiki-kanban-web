/**
 * Created by xubt on 4/20/16.
 */

var entriesControllers = angular.module('entriesControllers', []);


entriesControllers.controller('EntriesCtrl', ['$scope', '$q', 'Entries', 'Tasks',
    function ($scope, $q, Entries, Tasks) {
        var tasks = [];

        var entriesPromise = Entries.load(); // 同步调用，获得承诺接口var entryTasksPromise
        var entryTasksPromise = [];
        entriesPromise.then(function (data) {  // 调用承诺API获取数据 .resolve
            $scope.entries = data;

            angular.forEach($scope.entries, function (entry) {
                var _tasksPromise = Tasks.loadTasksByEntryId(entry.id);
                entryTasksPromise.push(_tasksPromise);

            });
            $q.all(entryTasksPromise).then(function (data) {
                for (var index in data) {
                    tasks = tasks.concat(data[index]);
                }
                console.log(tasks);
                $scope.tasks = tasks;
                $scope.sortableOptions = {
                    connectWith: ".tasks",
                    opacity: 0.5,
                    start: function (e, ui) {
                        // console.log("-----------" + $(ui.item.sortable.droptarget[0]).attr("entry"));
                        //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
                    },
                    update: function (e, ui) {
                        console.log("===========" + $(ui.item.sortable.droptarget[0]).attr("entry"));
                    },
                    stop: function (e, ui) {
                        console.log(ui.item.scope());
                        var targetEntryId = JSON.parse($(ui.item.sortable.droptarget[0]).attr("entry")).id;
                        ui.item.sortable.model.entryId = targetEntryId;
                        console.log(ui.item.sortable.model);
                    }
                };
            });
        });

        $scope.createEntry = function () {
            var title = $scope.title;
            var entry = {id: 3333, title: title, status: 0};
            $scope.entries.push(entry);
        };

        $scope.showCreateTaskForm = function (entryId) {
            $("#task-create-button-" + entryId).hide();
            $("#task-create-form-" + entryId).show();
        };

        $scope.cancelCreateTask = function (entryId) {
            $("#task-create-form-" + entryId).hide();
            $("#task-create-button-" + entryId).show();
        };
    }]);
