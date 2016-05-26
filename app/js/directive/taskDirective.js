/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('tasks', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/tasks.html',
        replace: true
    };
})


kanbanApp.directive('taskCreation', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/task-creation.html',
    };
})


kanbanApp.directive('entryCreation', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/entry-creation.html',
        replace: true
    };
})

