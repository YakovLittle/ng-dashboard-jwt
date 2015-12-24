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

    //Get CSV Array
    export function getCSVArray() {
        return function(content, separator = ',', fhead?) {
            var rows = content.split(/[\r\n]+/g);
            var CSV = [];
            var headers = [];
            headers = rows[0].split(separator);
            var columnCnt = headers.length;
            for (var i = 1; i < rows.length; i++) {
                var obj = {};
                var row = rows[i].split(separator);
                if ( row.length === columnCnt ) {            
                    for (var j = 0; j < headers.length; j++) {
                        var col = headers[j].replace(/^\"+|\"+$/g, '');
                        if (fhead instanceof Object) {
                            if (!(col in fhead)) {//skipped column
                                continue;
                            }
                        }
                        obj[col] = row[j].replace(/^\"+|\"+$/g, '');
                    }
                    CSV.push(obj);
                } else {
                    if ((i !== (rows.length-1)) && (row !== '')){
                        console.log('Parse error: ' + row);
                        continue;
                    }
                }
            }
            return CSV;
        }
    }
}