/**
 * Created by xubt on 4/29/16.
 */

kanbanApp.directive('entry', function ($uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'component/entry/partials/entry.html',
        replace: true,
        transclude: true,
        scope: {
            entry: '='
        },
        controller: ['$scope', 'boardsService', 'entriesServices', function ($scope, boardsService, entriesServices) {
            $scope.displayEntryMenu = false;
            $scope.onEntryMenuMouseOver = function ($event) {
                $scope.displayEntryMenu = true;
            };
            $scope.onEntryMenuMouseLeave = function ($event) {
                $scope.displayEntryMenu = false;
            };

            var currentScope = $scope;
            $scope.openModal = function (_message, _link) {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'foundation/modal/partials/confirm-dialog.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.title = '警告';
                        $scope.message = "确定要删除" + _message + "吗?";
                        $scope.ok = function () {
                            var _entryDeletePromise = entriesServices.deleteByLink(_link);
                            _entryDeletePromise.then(function () {
                                currentScope.$parent.loadEntries();
                            });
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };
            $scope.updateEntry = function (_title, _entry) {
                var entry = _entry;
                if (entry.title === "") {
                    return;
                }
                entry.title = _title;
                var entryPromise = entriesServices.update(entry);
                entryPromise.then(function () {
                });
            };
        }]
    };
});
