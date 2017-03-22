/* Services */

kanbanApp.factory('commentService', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        loadComments: function (_commentsUrl) {
            return httpServices.get(_commentsUrl);
        },
        create: function (_comment, _commentsUrl) {
            return httpServices.post(_comment, _commentsUrl);
        },
        update: function (_comment) {
            return httpServices.put(_comment, _comment._links.self.href);
        },
        delete: function (_comment) {
            return httpServices.delete(_comment._links.self.href);
        },
        move: function (_comments, _resortLink) {
            return httpServices.put(_comments, _resortLink);
        }
    };
}]);
