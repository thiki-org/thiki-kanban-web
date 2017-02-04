/**
 * Created by xubt on 5/26/16.
 */
kanbanApp.factory('projectsService', ['$http', '$q', 'httpServices',
    function ($http, $q, httpServices) {
        return {
            projectsLink: '',
            load: function (_projectsLink) {
                return httpServices.get(_projectsLink);
            },
            loadProjectByLink: function (_projectLink) {
                return httpServices.get(_projectLink);
            },
            loadMembers: function (_membersLink) {
                return httpServices.get(_membersLink);
            },
            invite: function (_invitation, _invitationLink) {
                return httpServices.post(_invitation, _invitationLink);
            },
            create: function (_project, _projectsLink) {
                return httpServices.post(_project, _projectsLink);
            },
            update: function (_project) {
                return httpServices.put(_project, _project._links.self.href);
            },
            deleteProject: function (_project) {
                return httpServices.post(_project, _project._links.self.href);
            }
        };
    }]);
