'use strict';

/* App Module */
var config = {
    localhost: 'http://localhost:8080'
}

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'boardController',
    'entriesControllers',
    'entriesServices',
    'ui.sortable',
    'tasksServices',
    'boardService'
]);

kanbanApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/entries', {
            templateUrl: 'partials/boards.html',
            controller: 'EntriesCtrl'
        }).when('/boards/:boardId/entries', {
            templateUrl: 'partials/entries.html'
        }).when('/boards', {
            templateUrl: 'partials/boards.html',
            controller: 'TasksCtrl'
        }).otherwise({
            templateUrl: 'partials/boards.html',
            controller: 'BoardsCtrl'
        });
    }]);
