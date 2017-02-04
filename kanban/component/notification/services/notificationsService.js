/**
 * Created by xubt on 9/20/16.
 */
kanbanApp.factory('notificationsService', ['httpServices',
    function (httpServices) {
        return {
            projectsLink: '',
            loadUnreadNotificationsTotal: function (_loadUnreadNotificationsTotalLink) {
                return httpServices.get(_loadUnreadNotificationsTotalLink);
            },
            loadNotifications: function (_notificationsUrl) {
                return httpServices.get(_notificationsUrl);
            },
            loadNotificationByLink: function (_notificationUrl) {
                return httpServices.get(_notificationUrl);
            }
        };
    }]);
