/// <reference path='../_all.d.ts' />

module App.Controllers {
    'use strict';

    export class NavCtrl {
        static $inject = ['$scope', 'authService', 'BackendAPI'];
        private curEnv: string;

        //Initialization
        constructor(private $scope: ISPAScope, private authService: Services.Authentication, private BackendAPI: Services.BackendAPI) {
            $scope.vm = this;
            //
            this.curEnv = '#';
        }
         
        //
        chooseEnv(value: string){
            this.curEnv = angular.uppercase(value);
        }
    }
}