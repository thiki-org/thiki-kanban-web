/**
 * Created by xubt on 16/02/2017.
 */
kanbanApp.filter('cardsFilter', ["advancedFilterFactory", function(advancedFilterFactory) {
    return function(_cards, _filter) {
        if (_filter === undefined || Object.keys(_filter).length === 0) {
            return _cards;
        }
        var filtered = [];
        for (var index in _cards) {
            var card = _cards[index];
            if (_filter !== "") {
                if (card.summary.indexOf(_filter.keyword) == -1 && (card.code === undefined || card.code === "")) {
                    continue;
                }
                if (card.summary.indexOf(_filter.keyword) == -1 && (card.code !== undefined && card.code.indexOf(_filter.keyword) == -1)) {
                    continue;
                }
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
            if (_filter.members !== undefined && _filter.members.items !== undefined && _filter.members.items.length > 0) {
                var isHaveMembers = false;
                var matchedMembersCount = 0;
                for (var itemIndex in _filter.members.items) {
                    for (var assignmentIndex in card.assignments.assignments) {
                        if (card.assignments.assignments[assignmentIndex].assignee === _filter.members.items[itemIndex]) {
                            isHaveMembers = true;
                            matchedMembersCount++;
                        }
                    }
                }
                if (_filter.members.memberMatchType === 'and' && _filter.members.items.length > matchedMembersCount) {
                    continue;
                }
                if (!isHaveMembers) {
                    continue;
                }
            }
            if (_filter.size > -1) {
                if (_filter.size === 0 && (card.size !== undefined)) {
                    continue;
                }
                if (_filter.size > 0 && _filter.size !== card.size) {
                    continue;
                }
            }
            if (_filter.elapsedDays > -1) {
                if (card.elapsedDays === 0 || card.elapsedDays > _filter.elapsedDays) {
                    continue;
                }
            }
            filtered.push(card);
        }
        return filtered;
    };
}]);