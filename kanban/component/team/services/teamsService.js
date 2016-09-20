/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.factory('teamsService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            teamsLink: '',
            load: function (_teamsLink) {
                return httpServices.get(_teamsLink);
            },
            loadTeamByLink: function (_teamLink) {
                return httpServices.get(_teamLink);
            },
            loadMembers: function (_membersLink) {
                return httpServices.get(_membersLink);
            },
            invite: function (_invitation, _invitationLink) {
                return httpServices.post(_invitation, _invitationLink);
            },
            create: function (_team, _teamsLink) {
                return httpServices.post(_team, _teamsLink);
            },
            update: function (_team) {
                return httpServices.put(_team, _team._links.self.href);
            },
            deleteTeam: function (_team) {
                return httpServices.post(_team, _team._links.self.href);
            }
        };
    }]);
