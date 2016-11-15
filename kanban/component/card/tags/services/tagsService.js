/**
 * Created by xubt on 11/14/16.
 */
kanbanApp.factory('cardTagsService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            loadTagsByCard: function (_link) {
                return httpServices.get(_link);
            },
            stickTags: function (_stickTags, _cardTagsLink) {
                return httpServices.post(_stickTags, _cardTagsLink);
            }
        };
    }]);
