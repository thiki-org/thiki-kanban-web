kanbanApp.factory('advancedFilterFactory', function() {
    var initialFilter = {
        keyword: "",
        isOpenAdvanced: false,
        tags: { items: [], tagMatchType: 'or' },
        members: { items: [], memberMatchType: 'or' },
        size: -1,
        elapsedDays: -1
    };
    var filter = JSON.parse(JSON.stringify(initialFilter));
    var board;
    return {
        resetFilter: function() {
            filter = JSON.parse(JSON.stringify(initialFilter));
        },
        getFilter: function() {
            return filter;
        },
        setFilter: function(_data) {
            filter = _data;
        },
        toggle: function() {
            filter.isOpenAdvanced = !filter.isOpenAdvanced;
        },
        closeAdvanced: function() {
            filter.isOpenAdvanced = false;
        },
        setBoard: function(_board) {
            board = _board;
        },
        getBoard: function() {
            return board;
        },
        addTag: function(_tag) {
            var index = filter.tags.items.indexOf(_tag.id);
            if (index > -1) {
                filter.tags.items.splice(index, 1);
                return;
            }
            filter.tags.items.push(_tag.id);
        },
        setKeyword: function(_keyword) {
            filter.keyword = _keyword;
        },
        setTagMatchType: function(_tagMatchType) {
            filter.tags.tagMatchType = _tagMatchType;
        },
        setMemberMatchType: function(_memberMatchType) {
            filter.members.memberMatchType = _memberMatchType;
        },
        addMember: function(_member) {
            var index = filter.members.items.indexOf(_member.userName);
            if (index > -1) {
                filter.members.items.splice(index, 1);
                return;
            }
            filter.members.items.push(_member.userName);
        },
        setSize: function(_size) {
            filter.size = _size;
        },
        resetSize: function() {
            filter.size = -1;
        },
        setElapsedDays: function(_elapsedDays) {
            filter.elapsedDays = _elapsedDays;
        },
        resetElapsedDays: function() {
            filter.elapsedDays = -1;
        },
        setFilterResultCount: function(_resultCount) {
            filter.resultCount = _resultCount;
        },
        isSearch: function() {
            if (filter.keyword !== "") {
                return true;
            }
            if (filter.tags.items.length !== 0) {
                return true;
            }
            if (filter.members.items.length !== 0) {
                return true;
            }
            if (filter.size !== -1) {
                return true;
            }
            if (filter.elapsedDays !== -1) {
                return true;
            }
            return false;
        }
    };
});