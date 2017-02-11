/**
 * Created by xubt on 02/11/17.
 */
kanbanApp.factory('pagesService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            boardsLink: '',
            loadPages: function (_pagesLink) {
                return httpServices.get(_pagesLink);
            },
            savePage: function (_page, _pageLink) {
                if (_page._links !== undefined) {
                    return httpServices.put(_page, _page._links.self.href);
                }
                return httpServices.post(_page, _pageLink);
            },
        };
    }]);
