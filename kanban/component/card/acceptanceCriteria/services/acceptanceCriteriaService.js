/* Services */

kanbanApp.factory('acceptanceCriteriaService', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        loadAcceptanceCriterias: function (_acceptanceCriteriasUrl) {
            return httpServices.get(_acceptanceCriteriasUrl);
        },
        create: function (_acceptanceCriteria, _acceptanceCriteriasUrl) {
            return httpServices.post(_acceptanceCriteria, _acceptanceCriteriasUrl);
        },
        update: function (_acceptanceCriteria) {
            return httpServices.put(_acceptanceCriteria, _acceptanceCriteria._links.self.href);
        },
        delete: function (_acceptanceCriteria) {
            return httpServices.delete(_acceptanceCriteria._links.self.href);
        },
        resort: function (_acceptanceCriterias, _resortLink) {
            return httpServices.put(_acceptanceCriterias, _resortLink);
        },
        submitVerification: function (_verifications, _verificationsLink) {
            return httpServices.post(_verifications, _verificationsLink);
        },
        loadVerifications: function (_verificationsLink) {
            return httpServices.get(_verificationsLink);
        }
    };
}]);
