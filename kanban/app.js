/* App Module */

var kanbanApp = angular.module('kanbanApp', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'ui.sortable',
    'xeditable',
    'LocalStorageModule',
    'ui.router',
    'mgcrea.ngStrap',
    'ui.select',
    'ngSanitize',
    'uiSwitch',
    'ngFileUpload',
    'angular-cache',
    'duScroll',
    'textAngular',
    "datePicker",
    "ng-showdown",
    "simplemde",
    "pageslide-directive",
    "nsPopover",
    "toaster",
    "dcbImgFallback"
]);
kanbanApp.config(['$routeProvider', '$httpProvider', 'localStorageServiceProvider', '$stateProvider', '$urlRouterProvider',
    function ($routeProvider, $httpProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {
        localStorageServiceProvider.setPrefix('thiki.kanban').setStorageType('sessionStorage');
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];

        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

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
            .state('projects', {
                url: "/:userName/projects",
                views: {
                    "register": {template: " "},
                    "kanban": {
                        templateUrl: "component/project/partials/projects.html",
                        controller: 'projectsController'
                    },
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('project', {
                url: "/projects/:projectId",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/project/partials/project.html", controller: 'projectController'},
                    "kanban-banner": {templateUrl: "component/banner/partials/banner.html"}
                }
            })
            .state('stages', {
                url: "/boards/:boardId",
                views: {
                    "register": {template: " "},
                    "kanban": {templateUrl: "component/stage/partials/stages-partial.html"},
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
    }
]);