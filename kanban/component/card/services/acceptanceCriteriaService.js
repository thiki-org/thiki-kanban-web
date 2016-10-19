/* Services */

kanbanApp.factory('acceptanceCriteriaService', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        loadAcceptanceCriterias: function (_acceptanceCriteriasUrl) {
            return httpServices.get(_acceptanceCriteriasUrl);
        },
        create: function (_acceptanceCriteria, _acceptanceCriteriasUrl) {
            return httpServices.post(_acceptanceCriteria, _acceptanceCriteriasUrl);
        },
        update: function (_card) {
            return httpServices.put(_card, _card._links.self.href);
        },
        deleteByLink: function (_link) {
            return httpServices.delete(_link);
        }
    };
}]);
