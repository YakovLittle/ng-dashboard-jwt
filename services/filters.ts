/// <reference path='../_all.d.ts' />

module App.Filters {
    'use strict';

    //Get localized message
    export function getStr4Locale(): Function {
        return function(index) {
        	//TODO: Add Locale support
        	if (index in Locale.i18n) {
        		return Locale.i18n[index];
        	} else {
				console.log('UNKNOWN STRING INDEX:' + index);//NOTE: i18n log errors
				return index;
        	}
        }
    }
}