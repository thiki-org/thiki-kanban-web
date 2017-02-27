/**
 * Created by xubt on 02/26/17.
 */
kanbanApp.factory('membersService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            loadByBoard: function (_boardLink) {
                return httpServices.get(_boardLink);
            }
        };
    }]);
