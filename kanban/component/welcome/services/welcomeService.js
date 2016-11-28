/* Services */

kanbanApp.factory('welcomeServices', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        loadEntrance: function (_entranceUrl) {
            return httpServices.get(_entranceUrl);
        }
    };
}]);
