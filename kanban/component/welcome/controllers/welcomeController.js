/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('welcomeController', ['$scope', '$location', '$q', 'welcomeServices', 'publicKeyServices', 'localStorageService', '$uibModal', '$window', 'usersService',
    function ($scope, $location, $q, welcomeServices, publicKeyServices, localStorageService, $uibModal, $window, usersService) {
        welcomeServices.loadEntrance(kanbanApp.remote_entrance).then(function (_entranceData) {
            localStorageService.set("entranceData", _entranceData);
            localStorageService.set("publicKeyLink", _entranceData._links.publicKey.href);
        });
        if ($('.modal-backdrop').length > 0) {
            $window.location.reload();
        }
        $scope.isAlreadyLogin = usersService.getCurrentUser() !== null;
        $scope.register = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'component/register/partials/register.html',
                controller: "registerController",
                size: 'sm',
                backdrop: "static"
            });
        };
        $scope.login = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'component/login/partials/login.html',
                controller: "loginController",
                size: 'sm',
                backdrop: "static"
            });
        };

        $scope.backToKanban = function () {
            $location.path(usersService.getCurrentUser().userName + '/boards');
        };
    }]);
