/// <reference path='../_all.d.ts' />

module App.Controllers {
    'use strict';

    export class HomeCtrl {
        static $inject = ['$scope', '$filter', 'BackendAPI', '$modal'];
        private msg: string = '';
        private uiGrid: Models.GridActLog;
        private lastUpd: Date;
        private uiGridItems: Models.GridActLogSubmData;
        private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
       
        //Initialization
        constructor(private $scope: ISPAScope, private $filter: ng.IFilterService, private BackendAPI: Services.BackendAPI, private $modal: ng.ui.bootstrap.IModalService) {
        	$scope.vm = this;
            //
            this.msg = this.$filter('i18n')('dashboard');
            this.uiGrid = new Models.GridActLog();
        }

        //
        updateActionLog() {
            this.uiGrid = new Models.GridActLog();
            this.BackendAPI.doGET('actions-log')
                .then((data) => {
                    this.uiGrid.data = data;
                    this.lastUpd = new Date();
                })
                .catch((reason) => {//invalid JWT
                    this.BackendAPI.go2Page('logout', 'home');
                });
        }

        //Open Submitted Data
        openSubmData(row: IActionLog) {
            this.uiGridItems = new Models.GridActLogSubmData(row);
            //Set modal popup
            var options: ng.ui.bootstrap.IModalSettings = {
                animation: false,
                backdrop: 'static',
                templateUrl: 'htt/activity-log.html',
                scope: this.$scope,
                controller: 'modal',
                size: 'md'
            };
            this.modalInstance = this.$modal.open(options);
        }
    }
}