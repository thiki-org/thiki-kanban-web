/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.factory('boardsService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            load: function (_boardsLink) {
                return httpServices.get(_boardsLink);
            },
            loadBoardByLink: function (_boardLink) {
                return httpServices.get(_boardLink);
            },
            loadActiveSprint: function (_activeSprintLink) {
                return httpServices.get(_activeSprintLink);
            },
            saveSprint: function (_sprint, _sprintLink) {
                if (_sprint.startTime.format !== undefined) {
                    _sprint.startTime = _sprint.startTime.format("YYYY-MM-DD");
                }
                if (_sprint.endTime.format !== undefined) {
                    _sprint.endTime = _sprint.endTime.format("YYYY-MM-DD");
                }
                if (_sprint._links !== undefined) {
                    return httpServices.put(_sprint, _sprint._links.self.href);
                }
                return httpServices.post(_sprint, _sprintLink);
            },
            create: function (_board) {
                return httpServices.post(_board, this.boardsLink);
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
