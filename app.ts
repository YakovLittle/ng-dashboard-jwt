/// <reference path='_all.d.ts' />

module App {
	'use strict';


    var app = angular.module('SPA', ['ui.router', 'angular-loading-bar', 'ui.bootstrap',
    								 'ui.grid','ui.grid.autoResize','ui.grid.exporter','ui.grid.selection','ui.grid.edit','ui.grid.cellNav', 'ui.grid.resizeColumns'])

    	//Set Options
		.config(($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) => {
			return new Services.State($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider);
		})

		//Loading-Bar
		.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
			cfpLoadingBarProvider.latencyThreshold = 500;
		}])

		//RUN
		.run(function($rootScope, $location, $state, authService, BackendAPI) {
			//onChange Page-Event
			$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
				var nologged = function(referer) {
					console.log('Not logged');
					$rootScope.rootAuth = 0;
					$rootScope.rootEnv = '#';
					authService.removeUserData();//Remove User data
					e.preventDefault();
					BackendAPI.go2Page('login', referer);//Set Referer
				};
				//Checking JWT
				$rootScope.rootAuth = (authService.getUserData().token) || 0;//For disable Auth -> 1
				switch (toState.name) {
					case 'logout':
						nologged(BackendAPI.getRefState());
						break;
				  	case 'login':
				    	if ($rootScope.rootAuth) {
				    		e.preventDefault();
				    		BackendAPI.go2Page(BackendAPI.getRefState(), '');//Redirect to Referer
						}
				    	break;
				   	default:
						if (!$rootScope.rootAuth) {
							nologged(toState.name);
						}
				}
			});
		})

		//AuthInterceptor
		.factory('AuthInterceptor', function(sessionService, $q, $injector) {
			return {
				request: function(config) {
					config.header = config.headers || {};
					var token = sessionService.get('user').token;
					if (token) {
						config.headers.Authorization = token;//Add Authorization Header
					}
					return config;
				},
				responseError: function(response) {
					console.log(response);			
					return $q.reject(response);
				}
			};
		})

		//Localization Filter
		.filter('i18n', Filters.getStr4Locale)

		//CSV Filter for FileReader
		.filter('csvreader', Filters.getCSVArray)

		//Session Service
		.service('sessionService', Services.SessionService)

		//Backend API Service
		.service('BackendAPI', Services.BackendAPI)

		//Authentication Service
		.service('authService', Services.Authentication)

		//Navigation Controller
    	.controller('vm', Controllers.NavCtrl)

    	//Modal Controller
    	.controller('modal', Controllers.ModalCtrl);
}