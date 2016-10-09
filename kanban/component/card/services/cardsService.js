/* Services */

kanbanApp.factory('cardsServices', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        loadCardsByProcedureId: function (_cardsUrl) {
            return httpServices.get(_cardsUrl);
        },
        create: function (_card, _procedureCardsUrl) {
            return httpServices.post(_card, _procedureCardsUrl);
        },
        update: function (_card) {
            return httpServices.put(_card, _card._links.self.href);
        },
        deleteByLink: function (_link) {
            return httpServices.delete(_link);
        }
    };
}]);
