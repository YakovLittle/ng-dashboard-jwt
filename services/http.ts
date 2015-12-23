/// <reference path='../_all.d.ts' />

module App.Services {
    'use strict';

    /**
     * State Config
     */
    export class State {
        //Initialization
        constructor(public $stateProvider: ng.ui.IStateProvider, public $locationProvider: ng.ILocationProvider, public $urlRouterProvider: ng.ui.IUrlRouterProvider, public $httpProvider: ng.IHttpProvider) {
            $stateProvider //Pages
                .state('home', {
                    url: '/',
                    templateUrl: '/htt/home.html',
                    controller: Controllers.HomeCtrl
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/htt/login.html',
                    controller: Controllers.LoginCtrl
                })
                .state('logout', {
                    url: '/logout'
                })
                .state('stat', {
                    url: '/stat',
                    templateUrl: '/htt/stat.html'
                });
            $locationProvider.html5Mode({
                enabled: false //by default
            });
            $urlRouterProvider.otherwise('/');
            //Set HTTP interceptor
            $httpProvider.interceptors.push('AuthInterceptor');
        }
    }

    /**
     * Backend API
     */
    export class BackendAPI {
        static $inject = ['$http', '$state', 'sessionService', '$rootScope'];
        //
        private host: string;
        private API: Object;
        private apiDBG: number;

        constructor(private $http: ng.IHttpService, private $state: ng.ui.IStateService, private sessionService, private $rootScope: ISPAScope) {
            this.apiDBG = 1; //NOTE: if apiDBG = 1 then uses 'file' properties for API
            this.host = 'http://localhost:8080';//Backend
            //API
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
            }
        }

        //Get Referer State-Page 
        getRefState(): string {
            return (this.sessionService.get('referer-state').name) || 'home';
        }

        //Go to State
        go2Page(page, referer = '') {
            this.sessionService.set('referer-state', { 'name': referer });
            this.$state.go(page, {}, { reload: true });
        }

        //Switch Debug Mode
        switchDebugMode(){
            this.apiDBG = (this.apiDBG ? 0 : 1);
        }

        //Get API URL by Name
        getAPIurl(api: string, args = ''): string {
            if (api in this.API) {
                var field = 'url'; 
                if (this.apiDBG) {
                   field = 'file';
                }
                if ('args' in this.API[api]) {
                    args = args + this.API[api]['args'];
                }
                return (this.apiDBG ? '' : this.host) + this.API[api][field] + '?' + (this.$rootScope.rootEnv === '#' ? '' : 'env=' + angular.lowercase(this.$rootScope.rootEnv) + '&') + 'cache=' + (Math.random()*1000000) + args;
            }
            console.log("UNKNOWN API: " + api);
            return api;
        }

        //HTTP GET Request
        doGET(api: string, args = '', options = {}): ng.IPromise<any> {
            return this.$http.get(this.getAPIurl(api, args), options)
                .then((response) => {
                    if ('wrapper' in this.API[api]) {
                        return response.data[this.API[api]['wrapper']];
                    } else {
                       return response.data;
                    }
                });
        }

        //HTTP POST Request
        doPOST(api: string, data: string, args = '', options = {}): ng.IPromise<any> {
            return this.$http.post(this.getAPIurl(api, args), data, options)
                    .then((response) => {
                    if ('wrapper' in this.API[api]) {
                        return response.data[this.API[api]['wrapper']];
                    } else {
                       return response.data;
                    }
                });
        }
    }
}