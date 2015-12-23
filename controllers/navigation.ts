/// <reference path='../_all.d.ts' />

module App.Controllers {
    'use strict';

    export class NavCtrl {
        static $inject = ['$scope', '$rootScope'];

        //Initialization
        constructor(private $scope: ISPAScope, private $rootScope: ISPAScope) {
            $scope.vm = this;
            //
            this.$rootScope.rootEnv = '#';
        }
         
        //
        chooseEnv(value: string){
            this.$rootScope.rootEnv = angular.uppercase(value);
        }
    }
}