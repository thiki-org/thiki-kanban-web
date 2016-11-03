/**
 * Created by xubt on 11/3/16.
 */
kanbanApp.factory('teamMembersService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            leave: function (_link) {
                return httpServices.delete(_link);
            }
        };
    }]);
