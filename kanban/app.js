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

kanbanApp.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
kanbanApp.factory('myHttpResponseInterceptor', ['$q', '$location', function ($q, $location) {
    return {
        // optional method
        'request': function (config) {
            // do something on success
            return config;
        },

        // optional method
        'requestError': function (rejection) {
            // do something on error
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            return $q.reject(rejection);
        },


        // optional method
        'response': function (response) {
            // do something on success
            return response;
        },

        // optional method
        'responseError': function (rejection) {
            console.log(rejection);
            alert("请求出错");
            // do something on error
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            return $q.reject(rejection);
        }
    };
}]);
