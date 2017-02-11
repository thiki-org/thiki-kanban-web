/**
 * Created by xubt on 02/11/17.
 */
kanbanApp.factory('pagesService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            boardsLink: '',
            loadPages: function (_pagesLink) {
                return httpServices.get(_pagesLink);
            }
        };
    }]);
