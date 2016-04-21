'use strict';

/* Services */

var tasksServices = angular.module('tasksServices', ['ngResource']);

tasksServices.factory('Tasks', ['$resource',
    function ($resource) {
        console.log("我是Server")
        return $resource('tasks/:taskId.json', {}, {
            load: {method: 'GET', params: {taskId: 'tasks'}, isArray: true}
        });
    }]);
