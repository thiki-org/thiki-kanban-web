/* Services */

kanbanApp.factory('passwordService', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        applyRetrieval: function (_passwordRetrievalApplicationLink, _retrievalApplication) {
            return httpServices.send({
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(_retrievalApplication),
                url: _passwordRetrievalApplicationLink
            });
        },
        applyReset: function (_passwordResetApplicationLink, _resetApplication) {
            return httpServices.send({
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(_resetApplication),
                url: _passwordResetApplicationLink
            });
        },
        resetPassword: function (_passwordResetLink, _password) {
            return httpServices.send({
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(_password),
                url: _passwordResetLink
            });
        }
    };
}]);
