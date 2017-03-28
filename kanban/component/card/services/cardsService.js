/* Services */

kanbanApp.factory('cardsServices', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    var allCardsInBoard = [];
    return {
        loadCardsByStageId: function (_cardsUrl) {
            return httpServices.get(_cardsUrl);
        },
        create: function (_card, _stageCardsUrl) {
            return httpServices.post(_card, _stageCardsUrl);
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
        move: function (_cards, _resortLink) {
            return httpServices.put(_cards, _resortLink);
        },
        getAllCards: function (_board) {
            for (var stageIndex in _board.stagesNode.stages) {
                var stage = _board.stagesNode.stages[stageIndex];
                if (stage.archived || stage.inDoneStatus) {
                    continue;
                }
                for (var cardIndex in stage.cardsNode.cards) {
                    allCardsInBoard.push(stage.cardsNode.cards[cardIndex]);
                }
            }
            return allCardsInBoard;
        },
        filter: function (_board, _parentCardKeyword, _cardCode) {
            if (allCardsInBoard.length === 0) {
                this.getAllCards(_board);
            }
            var filteredCards = [];
            for (var index in allCardsInBoard) {
                var card = allCardsInBoard[index];
                if (card.code === _cardCode) {
                    continue;
                }
                if (card.code && card.code.indexOf(_parentCardKeyword) > -1 || card.summary.indexOf(_parentCardKeyword) > -1) {
                    filteredCards.push(allCardsInBoard[index]);
                }
            }
            return filteredCards;
        }
    };
}]);
