(function () {
'use strict';

angular.module('demoApp')
    .factory('alertServices', ['$mdToast', 'SweetAlert', alertServices]);

    function alertServices($mdToast, SweetAlert) {
        var service = {};

        service.showTopRightToast = showTopRightToast;
        service.proceedingToGate = proceedingToGate;
        service.arrivedOnGatePrompt = arrivedOnGatePrompt;

        service.showInsufficientTimeWarning = showInsufficientTimeWarning;
        service.showGateReminder = showGateReminder;
        service.showGateWarning = showGateWarning;
        service.showCannotAddPlace = showCannotAddPlace;


        function showTopRightToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(2000)
            );
        }

        function proceedingToGate(gateNo) {
            service.showTopRightToast('Proceeding to Gate ' + gateNo);
        }

        function arrivedOnGatePrompt (gateNo) {
            service.showTopRightToast('You are on Gate ' + gateNo);
        }

        function showInsufficientTimeWarning (timeRemaining) {
            var minsStr = timeRemaining.minutes > 1 ? ' minutes' : ' minute';
            var _title = timeRemaining.minutes > 0
                        ? 'You have ' + timeRemaining.minutes + minsStr
                        : 'You have no time';

            if(timeRemaining.seconds > 0) _title += ' and ' + timeRemaining.seconds + ' second/s';

            _title += ' left.';

            SweetAlert.swal({
                title: _title,
                type: 'warning'
            });
        }

        function showGateReminder (timeRemaining) {
            var minsStr = timeRemaining.minutes > 1 ? ' minutes' : ' minute';
            var _title = timeRemaining.minutes > 0
                ? 'You have ' + timeRemaining.minutes + minsStr
                : 'You have no time';

            //if (timeRemaining.seconds > 0) _title += ' and ' + timeRemaining.seconds + ' second/s';

            _title += ' left.';

            _title += ' Please Proceed to your Gate now.';

            SweetAlert.swal({
                title: _title,
                type: 'warning'
            });
        }

        function showGateWarning () {
            var message = 'Danger of missing your flight. Head to your gate immediately!';

            SweetAlert.swal({
                title: message,
                type: 'warning'
            });
        }

        function showCannotAddPlace (placeName, timeLeftInMinutes) {
            var message = "Can't stop in " + placeName + "Insufficient Time. ";
            message += " You have place "+ timeLeftInMinutes + " minute/s left. ";
            message += " Please proceed to your gate now.";

            SweetAlert.swal({
                title: message,
                type: 'warning'
            });
        }

        return service;
    }
}());