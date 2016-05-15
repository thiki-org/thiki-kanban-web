'use strict';

/* App Module */
var config = {
    localhost: 'http://localhost:8080'
}

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'entriesControllers',
    'entriesServices',
    'ui.sortable',
    'tasksServices'
]);

kanbanApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/entries', {
            templateUrl: 'partials/entries.html',
            controller: 'EntriesCtrl'
        }).when('/tasks', {
            templateUrl: 'partials/tasks.html',
            controller: 'TasksCtrl'
        }).otherwise({
            templateUrl: 'partials/entries.html',
            controller: 'EntriesCtrl'
        });
    }]);
