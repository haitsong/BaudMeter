/**
 * Created by chiwan on 7/28/2015.
 */
var eventLib = angular.module('eventLib');

eventLib.service('latencyDataService', [
    function() {

        var currentSelectCountyGB1999 = 320722;
        var currentCoId = 1;

        this.SetCountyGB1999 = function(obj){
            currentSelectCountyGB1999 = obj;
        };

        this.GetCountyGB1999 = function(){
            return currentSelectCountyGB1999;
        };

        this.GetCoId = function(){
            return currentCoId;
        };

        this.SetCoId = function(obj){
            currentCoId = obj;
        };
    }]
);


