/* Services */

kanbanApp.factory('publicKeyServices', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        loadPublicKey: function (_publicKeyLink) {
            return httpServices.get(_publicKeyLink);
        }
    };
}]);
