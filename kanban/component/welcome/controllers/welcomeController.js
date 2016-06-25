/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('welcomeController', ['$scope', '$location', '$q', 'boardsService', 'localStorageService', '$uibModal',
    function ($scope, $location, $q, boardsService, localStorageService, $uibModal) {
        $scope.register = function () {
            console.log("fsfs");
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
        };
    }]);
