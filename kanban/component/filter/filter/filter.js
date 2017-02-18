/**
 * Created by xubt on 16/02/2017.
 */
kanbanApp.filter('cardsFilter', function() {
    return function(_cards, _filter) {
        if (_filter === undefined || Object.keys(_filter).length === 0) {
            return _cards;
        }
        var filtered = [];
        for (var index in _cards) {
            var card = _cards[index];
            if (card.summary.indexOf(_filter.keyword) == -1 && (card.code !== undefined && card.code.indexOf(_filter.keyword) == -1)) {
                continue;
            }
            if (_filter.tags !== undefined && _filter.tags.items !== undefined && _filter.tags.items.length > 0) {
                var isHaveTags = false;
                var matchedTagsCount = 0;
                for (var itemIndex in _filter.tags.items) {
                    for (var tagIndex in card.tags.cardTags) {
                        if (card.tags.cardTags[tagIndex].tagId === _filter.tags.items[itemIndex]) {
                            isHaveTags = true;
                            matchedTagsCount++;
                        }
                    }
                }
                if (_filter.tags.tagMatchType === 'and' && _filter.tags.items.length > matchedTagsCount) {
                    continue;
                }
                if (!isHaveTags) {
                    continue;
                }
            }
            filtered.push(card);
        }
        return filtered;
    };
});