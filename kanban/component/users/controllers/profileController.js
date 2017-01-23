/**
 * Created by xubt on 9/30/16.
 */

kanbanApp.controller('profileController', ['$scope', '$location', '$q', 'publicKeyServices', 'loginService', 'localStorageService', '$uibModal', 'notificationsService', 'usersService', '$interval', 'timerMessageService', '$rootScope', 'profileService',
    function ($scope, $location, $q, publicKeyServices, loginService, localStorageService, $uibModal, notificationsService, usersService, $interval, timerMessageService, $rootScope, profileService) {
        $scope.title = '个人资料';
        $scope.ok = function () {
            localStorageService.clearAll();
            $uibModalInstance.close();
            $location.path("/welcome");
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        var profileLink = usersService.getCurrentUser()._links.profile.href;

        var profilePromise = usersService.loadProfile(profileLink);
        profilePromise.then(function (_profile) {
            localStorageService.set("profile", _profile);
            $scope.profile = _profile;
            $rootScope.profile = _profile;
            var avatarPromise = usersService.loadAvatar(_profile._links.avatar.href);
            avatarPromise.then(function (_avatar) {
                $rootScope.avatar = "data:image/png;base64," + _avatar.avatar.replaceAll("\"", "");
            });
        });

        $scope.updateProfile = function () {
            var profile = {nickName: $scope.profile.nickName};
            var profilePromise = profileService.updateProfile(profile, profileLink);
            profilePromise.then(function () {
                timerMessageService.message("保存成功");
            });
        };

        $scope.openAvatarUpload = function () {
            $uibModal.open({
                animation: false,
                templateUrl: 'component/users/partials/avatar-upload.html',
                controller: "avatarController",
                size: 'mid',
                backdrop: "static"
            });
        };
    }]);
