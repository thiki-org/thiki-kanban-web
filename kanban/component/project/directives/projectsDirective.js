/**
 * Created by xubt on 5/26/16.
 */

kanbanApp.directive('projectBanner', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/project/partials/project-banner.html',
        replace: true,
        controller: ['$scope', '$location', 'projectsService', 'localStorageService', '$uibModal', function ($scope, $location, projectsService, localStorageService, $uibModal) {
            var projectLink = localStorageService.get("projectLink");
            var projectsLink = localStorageService.get("identity.userName") + '/projects';

            var projectPromise = projectsService.loadProjectByLink(projectLink);
            projectPromise.then(function (_project) {
                $scope.project = _project;
            });
            $scope.toProjects = function () {
                $location.path(projectsLink);
            };
            $scope.updateProject = function (_name, _project) {
                var project = _project;
                if (_name === "") {
                    return "请输入看板名称";
                }
                project.name = _name;
                projectsService.update(project);
            };
            $scope.mouseover = function () {
                $scope.isDisplaySetting = true;
            };

            $scope.onMouseLeave = function () {
                $scope.isDisplaySetting = false;
            };
        }]
    };
});
