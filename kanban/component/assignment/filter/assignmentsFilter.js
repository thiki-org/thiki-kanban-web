/**
 * Created by xubt on 6/18/16.
 */
kanbanApp.filter('assignmentUserNameFilter', function () {
    return function (_userName) {
        if (_userName !== undefined && _userName.length > 1) {
            return _userName.split('')[_userName.length - 1];
        }
        return _userName;
    };
});
