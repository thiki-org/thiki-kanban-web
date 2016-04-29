/**
 * Created by xubt on 4/29/16.
 */

//自定义指令repeatFinish
kanbanApp.directive('repeatFinish',function($timeout){
    return {
        restrict:'A',

        link: function(scope,element,attr){
            console.log(scope.$index)
            if(scope.$last == true){
                console.log('ng-repeat执行完毕');
                $timeout(function() {
                    $('.entryTitle').editable();

                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
