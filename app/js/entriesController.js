/**
 * Created by xubt on 4/20/16.
 */

var entriesControllers = angular.module('entriesControllers', []);


entriesControllers.controller('EntriesCtrl', ['$scope', '$q', 'Entries', 'Tasks',
    function ($scope, $q, Entries, Tasks) {
        var tasks = [];

        var entriesPromise = Entries.load(); // 同步调用，获得承诺接口var entryTasksPromise
        var entryTasksPromise;
        entriesPromise.then(function (data) {  // 调用承诺API获取数据 .resolve
            $scope.entries = data;

            angular.forEach($scope.entries, function (entry) {
               var _tasks = Tasks.loadTasksByEntryId(entry.id);
                tasks = tasks.concat(_tasks);

            });
        });
        entriesPromise.finally(function () {

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

        $scope.sortableOptions = {
            placeholder: "task",
            connectWith: ".tasks",
            opacity: 0.5,
            start: function (e, ui) {
                ui.item.attr("opacity", "0.5");
                //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
            },
            update: function (e, ui) {
                ui.item.attr("opacity", "0.5");
                //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
            },
            stop: function (e, ui) {
                ui.item.attr("opacity", "1.0");
                //alert(ui.item.sortable.model.id + ui.item.sortable.model.title);
            }
        };
    }]);
