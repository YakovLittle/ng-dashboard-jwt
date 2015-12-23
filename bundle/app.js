var App;
(function (App) {
    var Services;
    (function (Services) {
        'use strict';
        var State = (function () {
            function State($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
                this.$stateProvider = $stateProvider;
                this.$locationProvider = $locationProvider;
                this.$urlRouterProvider = $urlRouterProvider;
                this.$httpProvider = $httpProvider;
                $stateProvider
                    .state('home', {
                    url: '/',
                    templateUrl: '/htt/home.html',
                    controller: App.Controllers.HomeCtrl
                })
                    .state('login', {
                    url: '/login',
                    templateUrl: '/htt/login.html',
                    controller: App.Controllers.LoginCtrl
                })
                    .state('logout', {
                    url: '/logout'
                })
                    .state('stat', {
                    url: '/stat',
                    templateUrl: '/htt/stat.html'
                });
                $locationProvider.html5Mode({
                    enabled: false
                });
                $urlRouterProvider.otherwise('/');
                $httpProvider.interceptors.push('AuthInterceptor');
            }
            return State;
        })();
        Services.State = State;
        var BackendAPI = (function () {
            function BackendAPI($http, $state, sessionService, $rootScope) {
                this.$http = $http;
                this.$state = $state;
                this.sessionService = sessionService;
                this.$rootScope = $rootScope;
                this.apiDBG = 1;
                this.host = 'http://localhost:8080';
                this.API = {
                    'jwt-auth': {
                        'url': '/auth',
                        'file': 'http://localhost/auth.php'
                    },
                    'actions-log': {
                        'url': '/dataload/dashboard',
                        'file': '/api/_dashboard.json',
                        'wrapper': 'dashboard'
                    }
                };
            }
            BackendAPI.prototype.getRefState = function () {
                return (this.sessionService.get('referer-state').name) || 'home';
            };
            BackendAPI.prototype.go2Page = function (page, referer) {
                if (referer === void 0) { referer = ''; }
                this.sessionService.set('referer-state', { 'name': referer });
                this.$state.go(page, {}, { reload: true });
            };
            BackendAPI.prototype.switchDebugMode = function () {
                this.apiDBG = (this.apiDBG ? 0 : 1);
            };
            BackendAPI.prototype.getAPIurl = function (api, args) {
                if (args === void 0) { args = ''; }
                if (api in this.API) {
                    var field = 'url';
                    if (this.apiDBG) {
                        field = 'file';
                    }
                    if ('args' in this.API[api]) {
                        args = args + this.API[api]['args'];
                    }
                    return (this.apiDBG ? '' : this.host) + this.API[api][field] + '?' + (this.$rootScope.rootEnv === '#' ? '' : 'env=' + angular.lowercase(this.$rootScope.rootEnv) + '&') + 'cache=' + (Math.random() * 1000000) + args;
                }
                console.log("UNKNOWN API: " + api);
                return api;
            };
            BackendAPI.prototype.doGET = function (api, args, options) {
                var _this = this;
                if (args === void 0) { args = ''; }
                if (options === void 0) { options = {}; }
                return this.$http.get(this.getAPIurl(api, args), options)
                    .then(function (response) {
                    if ('wrapper' in _this.API[api]) {
                        return response.data[_this.API[api]['wrapper']];
                    }
                    else {
                        return response.data;
                    }
                });
            };
            BackendAPI.prototype.doPOST = function (api, data, args, options) {
                var _this = this;
                if (args === void 0) { args = ''; }
                if (options === void 0) { options = {}; }
                return this.$http.post(this.getAPIurl(api, args), data, options)
                    .then(function (response) {
                    if ('wrapper' in _this.API[api]) {
                        return response.data[_this.API[api]['wrapper']];
                    }
                    else {
                        return response.data;
                    }
                });
            };
            BackendAPI.$inject = ['$http', '$state', 'sessionService', '$rootScope'];
            return BackendAPI;
        })();
        Services.BackendAPI = BackendAPI;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Locale;
    (function (Locale) {
        'use strict';
        Locale.i18n = {
            titlePage: "Data-Load Console",
            requiredFields: "Please fill in all of the required fields",
            invalidCredentials: "Invalid credentials",
            unavailableServer: "Data-Load Server is unavailable",
            environment: "Environment",
            dashboard: "Dashboard",
            viewData: "View Data",
            submData: "Submitted Data"
        };
    })(Locale = App.Locale || (App.Locale = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Filters;
    (function (Filters) {
        'use strict';
        function getStr4Locale() {
            return function (index) {
                if (index in App.Locale.i18n) {
                    return App.Locale.i18n[index];
                }
                else {
                    console.log('UNKNOWN STRING INDEX:' + index);
                    return index;
                }
            };
        }
        Filters.getStr4Locale = getStr4Locale;
    })(Filters = App.Filters || (App.Filters = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Services;
    (function (Services) {
        'use strict';
        var SessionService = (function () {
            function SessionService($window) {
                this.$window = $window;
            }
            SessionService.prototype.set = function (key, value) {
                this.$window.sessionStorage.setItem(key, angular.toJson(value));
            };
            SessionService.prototype.get = function (key) {
                return angular.fromJson(this.$window.sessionStorage.getItem(key)) || {};
            };
            SessionService.prototype.remove = function (key) {
                this.$window.sessionStorage.removeItem(key);
            };
            SessionService.$inject = ['$window'];
            return SessionService;
        })();
        Services.SessionService = SessionService;
        var Authentication = (function () {
            function Authentication(sessionService) {
                this.sessionService = sessionService;
            }
            Authentication.prototype.removeUserData = function () {
                this.sessionService.remove('user');
            };
            Authentication.prototype.getUserData = function () {
                var user = this.sessionService.get('user');
                return user;
            };
            Authentication.prototype.setUserData = function (data) {
                if (('token' in data) && ('environments' in data)) {
                    this.sessionService.set('user', data);
                    return true;
                }
                return false;
            };
            Authentication.$inject = ['sessionService'];
            return Authentication;
        })();
        Services.Authentication = Authentication;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
var App;
(function (App) {
    'use strict';
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var ModalCtrl = (function () {
            function ModalCtrl($scope) {
                this.$scope = $scope;
                $scope.modal = this;
            }
            ModalCtrl.$inject = ['$scope'];
            return ModalCtrl;
        })();
        Controllers.ModalCtrl = ModalCtrl;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var LoginCtrl = (function () {
            function LoginCtrl($rootScope, $scope, $filter, authService, BackendAPI) {
                this.$rootScope = $rootScope;
                this.$scope = $scope;
                this.$filter = $filter;
                this.authService = authService;
                this.BackendAPI = BackendAPI;
                this.msg = '';
                $scope.vm = this;
            }
            LoginCtrl.prototype.doLogin = function (valid) {
                var _this = this;
                if (!valid) {
                    this.msg = this.$filter('i18n')('requiredFields');
                    return;
                }
                if (this.pw === 'wrong') {
                    this.msg = this.$filter('i18n')('invalidCredentials');
                    return;
                }
                this.BackendAPI.doPOST('jwt-auth', '{"userName":"' + this.email + '", "password":"' + this.pw + '"}')
                    .then(function (data) {
                    if (_this.authService.setUserData(data)) {
                        _this.$rootScope.rootEnvs = _this.authService.getUserData().environments;
                        _this.BackendAPI.go2Page(_this.BackendAPI.getRefState(), '');
                    }
                    else {
                        _this.msg = _this.$filter('i18n')('invalidCredentials');
                    }
                })
                    .catch(function (reason) {
                    _this.msg = _this.$filter('i18n')('unavailableServer');
                });
            };
            LoginCtrl.$inject = ['$rootScope', '$scope', '$filter', 'authService', 'BackendAPI'];
            return LoginCtrl;
        })();
        Controllers.LoginCtrl = LoginCtrl;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var HomeCtrl = (function () {
            function HomeCtrl($scope, $filter, BackendAPI, $modal) {
                this.$scope = $scope;
                this.$filter = $filter;
                this.BackendAPI = BackendAPI;
                this.$modal = $modal;
                this.msg = '';
                $scope.vm = this;
                this.msg = this.$filter('i18n')('dashboard');
                this.uiGrid = new App.Models.GridActLog();
            }
            HomeCtrl.prototype.updateActionLog = function () {
                var _this = this;
                this.uiGrid = new App.Models.GridActLog();
                this.BackendAPI.doGET('actions-log')
                    .then(function (data) {
                    _this.uiGrid.data = data;
                    _this.lastUpd = new Date();
                })
                    .catch(function (reason) {
                    _this.BackendAPI.go2Page('logout', 'home');
                });
            };
            HomeCtrl.prototype.openSubmData = function (row) {
                this.uiGridItems = new App.Models.GridActLogSubmData(row);
                var options = {
                    animation: false,
                    backdrop: 'static',
                    templateUrl: 'htt/activity-log.html',
                    scope: this.$scope,
                    controller: 'modal',
                    size: 'md'
                };
                this.modalInstance = this.$modal.open(options);
            };
            HomeCtrl.$inject = ['$scope', '$filter', 'BackendAPI', '$modal'];
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var NavCtrl = (function () {
            function NavCtrl($scope, $rootScope) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                $scope.vm = this;
                this.$rootScope.rootEnv = '#';
            }
            NavCtrl.prototype.chooseEnv = function (value) {
                this.$rootScope.rootEnv = angular.uppercase(value);
            };
            NavCtrl.$inject = ['$scope', '$rootScope'];
            return NavCtrl;
        })();
        Controllers.NavCtrl = NavCtrl;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Models;
    (function (Models) {
        'use strict';
        var GridActLog = (function () {
            function GridActLog() {
                this.enableGridMenu = true;
                this.gridMenuShowHideColumns = false;
                this.exporterMenuCsv = true;
                this.exporterMenuPdf = false;
                this.enableSorting = true;
                this.enableFiltering = true;
                this.showGridFooter = true;
                this.exporterCsvFilename = 'activity_log.csv';
                this.appScopeProvider = {
                    onClick: function (row) {
                        angular.element('#bActionLog').controller().openSubmData(row.entity);
                    }
                };
                this.data = [];
                this.columnDefs = [
                    { field: 'eventTime', enableColumnMenu: false, displayName: 'Event Time', sort: { direction: 'desc', priority: 0 } },
                    { field: 'host', enableColumnMenu: false, displayName: 'Host' },
                    { field: 'environment', enableColumnMenu: false, displayName: 'Environment' },
                    { field: 'action', enableColumnMenu: false, displayName: 'Action' },
                    { field: 'submittedData', enableColumnMenu: false,
                        displayName: angular.element('#bActionLog').injector().get('$filter')('i18n')('submData'),
                        cellTemplate: '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.onClick(row)">{{ "viewData" | i18n }}</a></div>'
                    }
                ];
            }
            return GridActLog;
        })();
        Models.GridActLog = GridActLog;
        var GridActLogSubmData = (function () {
            function GridActLogSubmData(row) {
                this.enableGridMenu = false;
                this.gridMenuShowHideColumns = false;
                this.enableSorting = true;
                this.enableFiltering = true;
                this.showGridFooter = true;
                this.host = row.host;
                this.environment = row.environment;
                this.action = row.action;
                this.columnDefs = [{
                        field: 'submittedData', enableColumnMenu: false,
                        displayName: angular.element('#bActionLog').injector().get('$filter')('i18n')('submData')
                    }];
                this.data = [];
                for (var i in row.submittedData) {
                    this.data.push({
                        submittedData: row.submittedData[i]
                    });
                }
            }
            return GridActLogSubmData;
        })();
        Models.GridActLogSubmData = GridActLogSubmData;
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
var App;
(function (App) {
    'use strict';
    var app = angular.module('SPA', ['ui.router', 'angular-loading-bar', 'ui.bootstrap',
        'ui.grid', 'ui.grid.autoResize', 'ui.grid.exporter', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.resizeColumns'])
        .config(function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
        return new App.Services.State($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider);
    })
        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.latencyThreshold = 500;
        }])
        .run(function ($rootScope, $location, $state, authService, BackendAPI) {
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            var nologged = function (referer) {
                console.log('Not logged');
                $rootScope.rootAuth = 0;
                $rootScope.rootEnv = '#';
                authService.removeUserData();
                e.preventDefault();
                BackendAPI.go2Page('login', referer);
            };
            $rootScope.rootAuth = (authService.getUserData().token) || 0;
            switch (toState.name) {
                case 'logout':
                    nologged(BackendAPI.getRefState());
                    break;
                case 'login':
                    if ($rootScope.rootAuth) {
                        e.preventDefault();
                        BackendAPI.go2Page(BackendAPI.getRefState(), '');
                    }
                    break;
                default:
                    if (!$rootScope.rootAuth) {
                        nologged(toState.name);
                    }
            }
        });
    })
        .factory('AuthInterceptor', function (sessionService, $q, $injector) {
        return {
            request: function (config) {
                config.header = config.headers || {};
                var token = sessionService.get('user').token;
                if (token) {
                    config.headers.Authorization = token;
                }
                return config;
            },
            responseError: function (response) {
                console.log(response);
                return $q.reject(response);
            }
        };
    })
        .filter('i18n', App.Filters.getStr4Locale)
        .service('sessionService', App.Services.SessionService)
        .service('BackendAPI', App.Services.BackendAPI)
        .service('authService', App.Services.Authentication)
        .controller('vm', App.Controllers.NavCtrl)
        .controller('modal', App.Controllers.ModalCtrl);
})(App || (App = {}));
//# sourceMappingURL=app.js.map