/// <reference path='../_all.d.ts' />

module App.Controllers {
    'use strict';

    export class LoginCtrl {
        static $inject = ['$rootScope', '$scope', '$filter', 'authService', 'BackendAPI'];
        private msg: string = '';
        private email: string;
        private pw: string;
       
        //Initialization
        constructor(private $rootScope: ISPAScope, private $scope: ISPAScope, private $filter: ng.IFilterService, private authService: Services.Authentication, private BackendAPI: Services.BackendAPI) {
        	$scope.vm = this;
            //
        }

        //Login to Console
        doLogin(valid) {
            if (!valid){
                this.msg = this.$filter('i18n')('requiredFields');
                return; 
            }
            //NOTE: STUB -> Wrong password
            if (this.pw === 'wrong') {
                this.msg = this.$filter('i18n')('invalidCredentials');
                return;
            }
            //Call Authentication API
            this.BackendAPI.doPOST('jwt-auth', '{"userName":"' + this.email + '", "password":"' + this.pw + '"}')
            .then((data) => {//Authorization
                if (this.authService.setUserData(data)) {
                    this.$rootScope.rootEnvs = this.authService.getUserData().environments;//Get Environments List
                    this.BackendAPI.go2Page(this.BackendAPI.getRefState(), '');//Go to referer State
                } else {
                    this.msg = this.$filter('i18n')('invalidCredentials');
                }
            })
            .catch((reason) => {
                this.msg = this.$filter('i18n')('unavailableServer');
            });
        }
    }
}