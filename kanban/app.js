'use strict';

/* App Module */
var config = {
    localhost: 'http://localhost:8080'
}

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute', 'ngAnimate', 'ui.bootstrap',
    'boardController',
    'entriesServices',
    'ui.sortable',
    'tasksServices',
    'boardsService',
    'xeditable'
]);

kanbanApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/boards/:boardId/entries', {
            templateUrl: 'component/entry/partials/entry-partial.html'
        }).when('/boards', {
            templateUrl: 'component/board/partials/boards.html',
            controller: 'boardController'
        }).otherwise({
            templateUrl: 'component/board/partials/boards.html',
            controller: 'boardController'
        });
    }]);

kanbanApp.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
