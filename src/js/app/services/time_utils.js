(function(){
'use strict';

angular.module('demoApp')
    .factory('timeUtils', [timeUtils]);

    function timeUtils () {
        var service = {};

        service.timeAllowance = 2.5;
        service.timeAllowanceWarning = convertMinToSec(timeUtils.timeAllowance);

        service.convertSecToMin = convertSecToMin;
        service.convertMinToSec = convertMinToSec;
        service.convertMinToSecRaw = convertMinToSecRaw;
        service.formatElapseTime = formatElapseTime;

        function convertSecToMin(sec) {
            return sec / 60;
        }

        function convertMinToSec(min) {
            return Math.floor(min * 60);
        }

        function convertMinToSecRaw (min) {
            return min * 60;
        }

        function formatElapseTime(timeElapseSeconds) {
            var _minutes = Math.floor(timeElapseSeconds / 60);
            var _seconds = timeElapseSeconds - _minutes * 60;

            return {
                minutes: _minutes,
                seconds: ('0' + _seconds).slice(-2)
            };
        }

        return service;
    }
}());