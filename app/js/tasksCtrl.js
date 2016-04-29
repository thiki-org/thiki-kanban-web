/**
 * Created by xubt on 4/18/16.
 */
'use strict';

/* Controllers */

var tasksControllers = angular.module('tasksControllers', []);


tasksControllers.controller('TasksCtrl', ['$scope', 'Tasks',
    function ($scope, Tasks) {
        $scope.tasks = Tasks.load();
        console.log(Tasks.load());
        console.log(" 我是tasksCtrl....");

        $scope.statusFilter = {status: 1};


        $scope.createTask = function () {
            var title = $scope.title;
            var task = {id: 3333, title: title, status: 0};
            $scope.tasks.push(task)
        }
        $scope.sortableOptions = {
            placeholder: "task",
            connectWith: ".tasks",
            'ui-floating': true,
            stop: function (e, ui) {
                alert(ui.item.sortable.model.id+ui.item.sortable.model.title);
            }
        };
    }]);
