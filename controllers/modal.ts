/// <reference path='../_all.d.ts' />

module App.Controllers {
    'use strict';

    export class ModalCtrl {
        static $inject = ['$scope'];
     
        //Initialization
        constructor(private $scope: ISPAScope) {
        	$scope.modal = this;
            //
        }
    }
}