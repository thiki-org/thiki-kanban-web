/**
 * Created by xubt on 4/29/16.
 */

//自定义指令repeatFinish
kanbanApp.directive('repeatFinish', function ($timeout) {
    return {
        restrict: 'A',

        link: function (scope, element, attr) {
            if (scope.$last == true) {
                $timeout(function () {
                    $('.entryTitle').editable();
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
