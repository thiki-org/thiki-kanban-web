/**
 * Created by xubt on 4/20/16.
 */

kanbanApp.controller('projectsController', ['$scope', '$location', '$q', 'projectsService', 'localStorageService',
    function ($scope, $location, $q, projectsService, localStorageService) {
        var projectsLink = localStorageService.get("user.links").projects.href;
        var projectPromise = projectsService.load(projectsLink);
        projectsService.projectsLink = projectsLink;
        projectPromise.then(function (_data) {
            $scope.projects = _data.projects;
        });

        $scope.toProject = function (_projectId, _projectLink) {
            localStorageService.set("projectLink", _projectLink);
            $location.path('/projects/' + _projectId);
        };
        $scope.displayProjectCreationForm = true;
        $scope.displayForm = false;
        $scope.createProject = function () {
            if ($scope.name === undefined || $scope.name === "") {
                $scope.isShowNameError = true;
                return;
            }
            var name = $scope.name;
            var project = {name: name};
            var entriesPromise = projectsService.create(project, projectsLink);
            entriesPromise.then(function (data) {
                if ($scope.projects === null) {
                    $scope.projects = [];
                }
                $scope.projects.push(data);
                $scope.cancelCreateProject();
                $scope.name = "";
            });
        };
        $scope.keyPress = function ($event) {
            if ($event.keyCode == 13) {
                $scope.createProject();
            }
            if ($event.keyCode == 27) {
                $scope.cancelCreateProject();
            }
        };
        $scope.showProjectCreationForm = function () {
            $scope.displayProjectCreationForm = false;
            $scope.displayForm = true;
        };
        $scope.cancelCreateProject = function () {
            $scope.displayProjectCreationForm = true;
            $scope.displayForm = false;
        };
    }]);
