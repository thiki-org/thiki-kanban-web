/**
 * Created by xubt on 04/07/17.
 */
kanbanApp.factory('statisticsService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            loadBurnDownChart: function (_burnDownChartLink) {
                return httpServices.get(_burnDownChartLink);
            },
            refreshBurnDownChart: function (_burnDownChartLink) {
                return httpServices.post({}, _burnDownChartLink);
            }
        };
    }]);
