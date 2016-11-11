/**
 * Created by xubt on 11/9/16.
 */
kanbanApp.factory('tagsService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            loadTagsByBoard: function (_link) {
                return httpServices.get(_link);
            },
            loadBoardByLink: function (_boardLink) {
                return httpServices.get(_boardLink);
            },
            createTag: function (_tag, _tagsLink) {
                return httpServices.post(_tag, _tagsLink);
            },
            update: function (_board) {
                return httpServices.put(_board, _board._links.self.href);
            },
            deleteBoard: function (_board) {
                return httpServices.delete(_board._links.self.href);
            },
            uploadWorkTileTasks: function (_tasksFile, _worktileLink) {
                return httpServices.upload("worktileTasks", _tasksFile, _worktileLink);
            }
        };
    }]);
