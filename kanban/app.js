/* App Module */
var config = {
    localhost: 'http://localhost:8080'
};

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute', 'ngAnimate', 'ui.bootstrap',
    'boardController',
    'entriesServices',
    'ui.sortable',
    'tasksServices',
    'boardsService',
    'xeditable',
    'LocalStorageModule'
]);

kanbanApp.config(['$routeProvider', '$httpProvider', 'localStorageServiceProvider',
    function ($routeProvider, $httpProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('thiki.kanban').setStorageType('sessionStorage');
        $httpProvider.interceptors.push('myHttpResponseInterceptor');
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

