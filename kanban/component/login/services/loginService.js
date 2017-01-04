/* Services */

kanbanApp.factory('loginService', ['httpServices', '$q', function (httpServices, $q) {
    return {
        login: function (_loginLink, _identity, _password) {
            return httpServices.get(_loginLink, {identity: _identity, password: _password});
        }
    };
}]);
