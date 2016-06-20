/**
 * Created by xubt on 4/20/16.
 */

var registerController = angular.module('registerController', []);

registerController.controller('registerController', ['$scope', '$location', '$q', 'boardsService', 'localStorageService', '$uibModal',
    function ($scope, $location, $q, boardsService, localStorageService, $uibModal) {
        console.log("dsdsd");
        $uibModal.open({
            animation: true,
            templateUrl: 'component/register/partials/register.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.title = '注册';
                $scope.message = "注册信息";

                $scope.ok = function () {
                    $uibModalInstance.close();
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: 'sm'
        });
    }]);
