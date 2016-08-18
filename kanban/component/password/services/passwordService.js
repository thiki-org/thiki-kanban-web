/* Services */

kanbanApp.factory('passwordService', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        retrievalApplication: function (_passwordRetrievalApplicationLink, _retrievalApplication) {
            return httpServices.send({
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(_retrievalApplication),
                url: _passwordRetrievalApplicationLink
            });
        }
    };
}]);
