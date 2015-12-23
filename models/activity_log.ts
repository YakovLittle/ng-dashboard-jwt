/// <reference path='../_all.d.ts' />

module App.Models {
    'use strict';

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
        columnDefs: Array<Object>;
        data: Array<IActionLog>;
        appScopeProvider: Object;

        //UI-Grid options
        constructor(){
            this.exporterCsvFilename = 'activity_log.csv';
            this.appScopeProvider = {
                onClick: function(row) {
                    angular.element('#bActionLog').controller().openSubmData(row.entity);
                }
            };
            this.data = [];
            this.columnDefs = [
                { field: 'eventTime', enableColumnMenu: false, displayName: 'Event Time', sort: { direction: 'desc', priority: 0 }},
                { field: 'host', enableColumnMenu: false, displayName: 'Host' },
                { field: 'environment', enableColumnMenu: false, displayName: 'Environment' },
                { field: 'action',  enableColumnMenu: false, displayName: 'Action'},
                { field: 'submittedData', enableColumnMenu: false,
                    displayName: angular.element('#bActionLog').injector().get('$filter')('i18n')('submData'),
                    cellTemplate: '<div class="ui-grid-cell-contents"><a href ng-click="grid.appScope.onClick(row)">{{ "viewData" | i18n }}</a></div>'
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
        columnDefs: Array<Object>;
        data: Array<Object>;
        host: string;
        environment: string;
        action: string;

        //UI-Grid options
        constructor(row: IActionLog){
            this.host = row.host;
            this.environment = row.environment;
            this.action = row.action;
            this.columnDefs = [{
                field: 'submittedData', enableColumnMenu: false, 
                displayName:  angular.element('#bActionLog').injector().get('$filter')('i18n')('submData')
            }];
            this.data = [];
            for (var i in row.submittedData){
                this.data.push({
                    submittedData: row.submittedData[i]
                });
            }
        }
    }
}