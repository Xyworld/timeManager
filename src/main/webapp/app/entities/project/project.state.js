(function() {
    'use strict';

    angular
        .module('timeManagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('project', {
            parent: 'entity',
            url: '/project',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Projects'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/project/projects.html',
                    controller: 'ProjectController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('project-detail', {
            parent: 'entity',
            url: '/project/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Project'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/project/project-detail.html',
                    controller: 'ProjectDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Project', function($stateParams, Project) {
                    return Project.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('project.new', {
            parent: 'project',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/project/project-dialog.html',
                    controller: 'ProjectDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                title: null,
                                description: null,
                                currentMonthHours: null,
                                totalHours: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('project', null, { reload: true });
                }, function() {
                    $state.go('project');
                });
            }]
        })
        .state('project.edit', {
            parent: 'project',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/project/project-dialog.html',
                    controller: 'ProjectDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Project', function(Project) {
                            return Project.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('project', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('project.delete', {
            parent: 'project',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/project/project-delete-dialog.html',
                    controller: 'ProjectDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Project', function(Project) {
                            return Project.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('project', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
