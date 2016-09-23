/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('navigationBanner', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: 'component/banner/partials/navigation-banner.html'
    };
});
