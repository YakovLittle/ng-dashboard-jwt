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
		.run(function($rootScope, $location, $state, authService) {
			//onChange Page-Event
			$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
				var nologged = function() {
					console.log('Not logged');
					e.preventDefault();
					authService.go2Page('login');
				};
				$rootScope.rootAuth = (authService.getUserData().token) || '';//For disable Auth -> set '1'
				//Checking State-Page
				switch (toState.name) {
					case 'logout':
						if ($rootScope.rootAuth) {//Remove User data
							authService.removeUserData();
							$rootScope.rootAuth = false;
						} else {
							nologged();
						}
						break;
				  	case 'login':
				    	if ($rootScope.rootAuth) {
				    		e.preventDefault();
				    		authService.go2Page();//Redirect
						}
				    	break;
				   	default:
						if (!$rootScope.rootAuth) {//Set referer for Redirect after Login
							authService.setRefState(toState.name);
							nologged();
						}
				}
			});
		})

		//AuthInterceptor
		.factory('AuthInterceptor', function(sessionService, $q, $injector) {
			return {
				request: function(config) {
					config.header = config.headers || {};
					//Add Authorization Header
					if (sessionService.get('user').token) {
						config.headers.Authorization = 'Bearer ' + sessionService.get('user').token;
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