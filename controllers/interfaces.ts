/// <reference path='../_all.d.ts' />

module App {
    'use strict';

    export interface IWindow {
        sessionStorage: ISessionStorage;
    }

    export interface ISessionStorage {
        setItem(key: string, value: string): void;
        getItem(key: string): string;
        removeItem(key: string): void;
    }

    export interface IUserData {
        token: string;
        environments: Array<string>;
    }

    export interface ISPAScope extends ng.IScope {//View Model
        vm: Object;
        modal: Object;

        rootEnvs: Array<string>;
        rootAuth: string;
        modalInstance: ng.ui.bootstrap.IModalServiceInstance;
    }

    export interface IActionLog {//JSON fields
        eventTime: string;
        host: string;
        environment: string;
        action: string;
        submittedData: Array<any>;
    }
}