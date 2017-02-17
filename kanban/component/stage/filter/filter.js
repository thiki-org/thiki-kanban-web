/**
 * Created by xubt on 16/02/2017.
 */
kanbanApp.filter('cardsFilter', function () {
    return function (_cards, _board) {
        if (_board.filter === undefined) {
            return _cards;
        }
        var filtered = [];
        angular.forEach(_cards, function (_card) {
            if (_card.summary.indexOf(_board.filter.keyword) > -1 || (_card.code !== undefined && _card.code.indexOf(_board.filter.keyword) > -1)) {
                filtered.push(_card);
            }
        });
        return filtered;
    };
});