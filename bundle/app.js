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
                    url: '/logout',
                    templateUrl: '/htt/logout.html'
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
            function BackendAPI($http) {
                this.$http = $http;
                this.apiDBG = 1;
                this.host = 'http://localhost:8080';
                this.API = {
                    'jwt-auth': {
                        'url': '/auth',
                        'file': 'http://localhost/auth.php'
                    },
                    'actions-log': {
                        'url': '/dashboard',
                        'file': '/api/_dashboard.json',
                        'wrapper': 'dashboard'
                    }
                };
            }
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
                    if ((args === '') && ('args' in this.API[api])) {
                        args = this.API[api]['args'];
                    }
                    return (this.apiDBG ? '' : this.host) + this.API[api][field] + '?cache=' + (Math.random() * 1000000) + args;
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
            BackendAPI.$inject = ['$http'];
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
            dashboard: "Dashboard"
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
            function Authentication(sessionService, $state) {
                this.sessionService = sessionService;
                this.$state = $state;
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
                console.log(data);
                return false;
            };
            Authentication.prototype.getRefState = function () {
                return this.sessionService.get('referer-state').name;
            };
            Authentication.prototype.setRefState = function (page) {
                if (page === '') {
                    this.sessionService.remove('referer-state');
                    return;
                }
                var state = { 'name': page };
                this.sessionService.set('referer-state', state);
            };
            Authentication.prototype.go2Page = function (page) {
                if (page === void 0) { page = ''; }
                if (page === '') {
                    page = (this.getRefState()) || 'home';
                }
                this.$state.go(page, {}, { reload: true });
            };
            Authentication.$inject = ['sessionService', '$state'];
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
                        _this.authService.go2Page();
                        _this.authService.setRefState('');
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
            function NavCtrl($scope, authService, BackendAPI) {
                this.$scope = $scope;
                this.authService = authService;
                this.BackendAPI = BackendAPI;
                $scope.vm = this;
                this.curEnv = '#';
            }
            NavCtrl.prototype.chooseEnv = function (value) {
                this.curEnv = angular.uppercase(value);
            };
            NavCtrl.$inject = ['$scope', 'authService', 'BackendAPI'];
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
        var ActLogItem = (function () {
            function ActLogItem() {
            }
            return ActLogItem;
        })();
        Models.ActLogItem = ActLogItem;
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
                        angular.element("#bActionLog").controller().openSubmData(row.entity);
                    }
                };
                this.data = [];
                this.columnDefs = [
                    { field: 'eventTime', enableColumnMenu: false, displayName: 'Event Time', sort: { direction: 'desc', priority: 0 } },
                    { field: 'host', enableColumnMenu: false, displayName: 'Host' },
                    { field: 'environment', enableColumnMenu: false, displayName: 'Environment' },
                    { field: 'action', enableColumnMenu: false, displayName: 'Action' },
                    {
                        field: 'submittedData',
                        enableColumnMenu: false,
                        displayName: 'Submitted Data',
                        cellTemplate: '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.onClick(row)">View Data</a></div>'
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
                this.host = row['host'];
                this.environment = row['environment'];
                this.action = row['action'];
                this.columnDefs = [
                    { field: 'submittedData', enableColumnMenu: false, displayName: 'Submitted Data' }
                ];
                this.data = [];
                for (var i in row['submittedData']) {
                    var item = {
                        submittedData: row['submittedData'][i]
                    };
                    this.data.push(item);
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
        .run(function ($rootScope, $location, $state, authService) {
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            var nologged = function () {
                console.log('Not logged');
                e.preventDefault();
                authService.go2Page('login');
            };
            $rootScope.rootAuth = (authService.getUserData().token) || '';
            switch (toState.name) {
                case 'logout':
                    if ($rootScope.rootAuth) {
                        authService.removeUserData();
                        $rootScope.rootAuth = false;
                    }
                    else {
                        nologged();
                    }
                    break;
                case 'login':
                    if ($rootScope.rootAuth) {
                        e.preventDefault();
                        authService.go2Page();
                    }
                    break;
                default:
                    if (!$rootScope.rootAuth) {
                        authService.setRefState(toState.name);
                        nologged();
                    }
            }
        });
    })
        .factory('AuthInterceptor', function (sessionService, $q, $injector) {
        return {
            request: function (config) {
                config.header = config.headers || {};
                if (sessionService.get('user').token) {
                    config.headers.Authorization = 'Bearer ' + sessionService.get('user').token;
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