/// <reference path='../_all.d.ts' />

module App.Models {
    'use strict';

    /**
     * Activity Log Item
     */
    export class ActLogItem {
        //JSON fields
        public eventTime: string;
        public host: string;
        public environment: string;
        public action: string;
        public submittedData: Array<any>;

        constructor(){
            //
        }
    }

    /**
     * UI-Grid Activity Log
     */
    export class GridActLog {
        enableGridMenu: boolean = true;
        gridMenuShowHideColumns: boolean = false;
        exporterMenuCsv: boolean = true;
        exporterMenuPdf: boolean = false;
        enableSorting: boolean = true;
        enableFiltering: boolean = true;
        showGridFooter: boolean = true;
        exporterCsvFilename: string;
        columnDefs: Object;
        data: Array<any>;
        appScopeProvider: Object;

        //UI-Grid options
        constructor(){
            this.exporterCsvFilename = 'activity_log.csv';
            this.appScopeProvider = {
                onClick: function(row) {
                    angular.element("#bActionLog").controller().openSubmData(row.entity);
                }
            };
            this.data = [];
            this.columnDefs = [
                { field: 'eventTime', enableColumnMenu: false, displayName: 'Event Time', sort: { direction: 'desc', priority: 0 }},
                { field: 'host', enableColumnMenu: false, displayName: 'Host' },
                { field: 'environment', enableColumnMenu: false, displayName: 'Environment' },
                { field: 'action',  enableColumnMenu: false, displayName: 'Action'},
                {
                    field: 'submittedData',
                    enableColumnMenu: false,
                    displayName: 'Submitted Data',
                    cellTemplate: '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.onClick(row)">View Data</a></div>'
                }
            ];
        }
    }

    /**
     * UI-Grid Activity Log Submitted data
     */
    export class GridActLogSubmData {
        enableGridMenu: boolean = false;
        gridMenuShowHideColumns: boolean = false;
        enableSorting: boolean = true;
        enableFiltering: boolean = true;
        showGridFooter: boolean = true;
        columnDefs: Object;
        data: Array<any>;
        host: string;
        environment: string;
        action: string;

        //UI-Grid options
        constructor(row: Object){
            this.host = row['host'];
            this.environment = row['environment'];
            this.action = row['action'];
            this.columnDefs = [
                { field: 'submittedData', enableColumnMenu: false, displayName: 'Submitted Data' }
            ];
            this.data = [];
            for (var i in row['submittedData']){
                var item = {
                    submittedData: row['submittedData'][i]
                };
                this.data.push(item);
            }
        }
    }
}