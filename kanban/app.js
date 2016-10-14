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
    'mgcrea.ngStrap',
    'ui.select',
    'ngSanitize'
]);

kanbanApp.config(['$routeProvider', '$httpProvider', 'localStorageServiceProvider', '$stateProvider', '$urlRouterProvider',
    function ($routeProvider, $httpProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {
        localStorageServiceProvider.setPrefix('thiki.kanban').setStorageType('sessionStorage');
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $stateProvider
            .state('boards', {
                url: "/:userName/boards",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/board/partials/boards.html", controller: 'boardController'},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('dashboard', {
                url: "/:userName/dashboard",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/board/partials/boards.html", controller: 'boardController'},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('teams', {
                url: "/:userName/teams",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/team/partials/teams.html", controller: 'teamsController'},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('team', {
                url: "/teams/:teamId",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/team/partials/team.html", controller: 'teamController'},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('procedures', {
                url: "/boards/:boardId",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/procedure/partials/procedures-partial.html"},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('notifications', {
                url: "/:userName/notifications",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/notification/partials/notifications.html"},
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

