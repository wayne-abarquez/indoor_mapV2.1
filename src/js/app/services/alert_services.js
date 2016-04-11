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

            if(timeRemaining.seconds > 0) _title += ' and ' + timeRemaining.seconds + ' seconds';

            _title += ' left.';

            SweetAlert.swal({
                title: _title,
                type: 'warning'
            });
        }

        return service;
    }
}());