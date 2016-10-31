/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('welcomeController', ['$scope', '$location', '$q', 'welcomeServices', 'publicKeyServices', 'localStorageService', '$uibModal',
    function ($scope, $location, $q, welcomeServices, publicKeyServices, localStorageService, $uibModal) {
        welcomeServices.loadEntrance(kanbanApp.romote_entrance).then(function (_entranceData) {
            localStorageService.set("entranceData", _entranceData);
            localStorageService.set("publicKeyLink", _entranceData._links.publicKey.href);
        });
        $scope.register = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'component/register/partials/register.html',
                controller: "registerController",
                size: 'sm'
            });
        };
        $scope.login = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'component/login/partials/login.html',
                controller: "loginController",
                size: 'sm'
            });
        };
    }]);
