/**
 * Created by xubt on 6/13/16.
 */
kanbanApp.directive('focus', function ($timeout, $parse) {
    return function (scope, element, attrs) {
        scope.$watch(attrs.focus,
            function (newValue) {
                $timeout(function () {
                    newValue && element[0].focus();
                });
            }, true);
    };
});

