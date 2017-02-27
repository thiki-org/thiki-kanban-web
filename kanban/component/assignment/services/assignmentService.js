/* assignmentServices */

kanbanApp.factory('assignmentServices', ['$http', '$q', 'httpServices', function ($http, $q, httpServices) {
    return {
        assign: function (_assignments, _link) {
            return httpServices.post(_assignments, _link);
        },
        loadAssignments: function (_assignmentLink) {
            return httpServices.get(_assignmentLink);
        }
    };
}]);
