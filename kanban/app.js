'use strict';

/* App Module */
var config = {
    localhost: 'http://localhost:8080'
}

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'boardController',
    'entriesServices',
    'ui.sortable',
    'tasksServices',
    'boardsService'
]);

kanbanApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/entries', {
            templateUrl: 'board/partials/boards.html',
            controller: 'EntriesCtrl'
        }).when('/boards/:boardId/entries', {
            templateUrl: 'entry/partials/entries.html'
        }).when('/boards', {
            templateUrl: 'board/partials/boards.html',
            controller: 'boardController'
        }).otherwise({
            templateUrl: 'board/partials/boards.html',
            controller: 'boardController'
        });
    }]);
