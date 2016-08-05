/* App Module */
var config = {
    localhost: 'http://localhost:8080'
};

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute', 'ngAnimate', 'ui.bootstrap',
    'ui.sortable',
    'xeditable',
    'LocalStorageModule',
    'ui.router',
    'mgcrea.ngStrap'
]);

kanbanApp.config(['$routeProvider', '$httpProvider', 'localStorageServiceProvider', '$stateProvider', '$urlRouterProvider',
    function ($routeProvider, $httpProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {
        localStorageServiceProvider.setPrefix('thiki.kanban').setStorageType('sessionStorage');
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $stateProvider
            .state('boards', {
                url: "/users/:userName/boards",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/board/partials/boards.html", controller: 'boardController'},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('entries', {
                url: "/boards/:boardId",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/entry/partials/entry-partial.html"},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('welcome', {
                url: "/welcome",
                views: {
                    "welcome": {templateUrl: "component/welcome/partials/index.html"},
                    "kanban-banner": {template: " "},
                    "kanban": {template: " "}
                }
            });

        $urlRouterProvider.otherwise('/welcome');
    }]);

