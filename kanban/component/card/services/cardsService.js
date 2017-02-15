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
            if (_card.deadline !== undefined && _card.deadline.format !== undefined) {
                _card.deadline = _card.deadline.format("YYYY-MM-DD");
            }
            return httpServices.put(_card, _card._links.self.href);
        },
        deleteByLink: function (_link) {
            return httpServices.delete(_link);
        },
        resort: function (_cards, _resortLink) {
            return httpServices.put(_cards, _resortLink);
        }
    };
}]);
