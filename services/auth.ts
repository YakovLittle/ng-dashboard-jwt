/// <reference path='../_all.d.ts' />

module App.Services {
    'use strict';

    /**
     * sessionStorage service
     */
    export class SessionService {
        static $inject = ['$window'];

        constructor(private $window: IWindow) {
            //
        }

        //Set value by key
        set(key, value) {
            this.$window.sessionStorage.setItem(key, angular.toJson(value));
        }

        //Get value by key
        get(key): Object {
            return angular.fromJson(this.$window.sessionStorage.getItem(key)) || {};
        }

        //Remove value by key
        remove(key) {
            this.$window.sessionStorage.removeItem(key);
        }
    }

    /**
     * Authentication service
     */
    export class Authentication {
        static $inject = ['sessionService', '$state'];

        //Initialization
        constructor(private sessionService, private $state: ng.ui.IStateService) {
            //
        }

        //Remove User Data
        removeUserData() {
            this.sessionService.remove('user');
        }

        //Get User Data
        getUserData(): IUserData {
            var user = this.sessionService.get('user');
            //TODO: Check token
            return user;
        }        

        //Set User Data
        setUserData(data: IUserData): boolean {
            if (('token' in data) && ('environments' in data)) {
                this.sessionService.set('user', data);
                return true;
            }
            console.log(data);
            return false;
        }

        //Get Referer State-Page 
        getRefState(): string {
            return this.sessionService.get('referer-state').name;
        }

        //Set Referer State-Page
        setRefState(page) {
            if (page === '') {
                this.sessionService.remove('referer-state');
                return;
            }
            var state = { 'name': page };
            this.sessionService.set('referer-state', state);
        }

        //Open another state
        go2Page(page: string = '') {
            if (page === '') {
                page = (this.getRefState()) || 'home';//by default
            }
            this.$state.go(page, {}, { reload: true });
        }
    }
}