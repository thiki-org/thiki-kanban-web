/* App Module */
var config = {
    localhost: 'http://localhost:8080'
};

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute', 'ngAnimate', 'ui.bootstrap',
    'boardController',
    'registerController',
    'entriesServices',
    'ui.sortable',
    'tasksServices',
    'boardsService',
    'xeditable',
    'LocalStorageModule',
    'ui.router'
]);

kanbanApp.config(['$routeProvider', '$httpProvider', 'localStorageServiceProvider', '$stateProvider',
    function ($routeProvider, $httpProvider, localStorageServiceProvider, $stateProvider) {
        localStorageServiceProvider.setPrefix('thiki.kanban').setStorageType('sessionStorage');
        $httpProvider.interceptors.push('httpInterceptor');

        $stateProvider
            .state('register', {
                url: "/register",
                views: {
                    "register": {templateUrl: "component/register/partials/register.html"},
                    "kanban": {template: " "},
                }
            })
            .state('boards', {
                url: "/boards",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/board/partials/boards.html", controller: 'boardController'}
                }
            })
            .state('entries', {
                url: "/boards/:boardId/entries",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/entry/partials/entry-partial.html"}
                }
            });
    }]);

