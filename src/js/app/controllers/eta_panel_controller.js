(function(){
'use strict';

angular.module('demoApp')
    .controller('etaPanelController', ['$scope', '$rootScope', '$interval', 'airportUtils', 'timeUtils', 'airportServices', 'gmapServices', 'alertServices', etaPanelController]);

    function etaPanelController ($scope, $rootScope, $interval, airportUtils, timeUtils, airportServices, gmapServices, alertServices) {
        var vm = this;

        /* Timer Variables */
        $scope.timerRunning = false;

        var timeElapseInterval;
        vm.showTimeRemainingInput = false;
        vm.timeRemaining = {
            input: null,
            elapse: null,
            elapseSeconds: null,
            elapseFormatted: {
                minutes: null,
                seconds: null
            }
        };

        vm.etaToDest = null;
        vm.etaToPlace = null;
        vm.totalEta = null;

        vm.placeName = '';
        vm.stops = [];
        vm.etaDetail = '';
        vm.gateNo = '';

        vm.initialize = initialize;
        vm.setTimeRemaining = setTimeRemaining;
        vm.timeRemainingInputKeydown = timeRemainingInputKeydown;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            // for the purpose of simulation
            $rootScope.$on('set-time-remaining', function (event, params) {
                vm.timeRemaining.input = params.time;
            });

            $rootScope.$on('show-nearby-places', function (event, params) {
                vm.etaToDest = airportUtils.computeETAByPath(params.path);
            });

            $rootScope.$on('gate-clicked', function(e, p){
                $rootScope.$apply(function(){
                    vm.gateNo = p.gateNo;
                    vm.etaToPlace = null;
                    vm.placeName = '';
                });
            });

            $rootScope.$on('new-place-route', function (ev, params) {
                vm.placeName = params.placeName;
                vm.etaToPlace = params.eta;
            });

            gmapServices.streetviewPanorama.addListener('position_changed', function () {
                var near = airportUtils.getPathFromPolyline(gmapServices.streetviewPanorama.getPosition(), airportServices.generatedPath),
                    nearPlace = airportUtils.getPathFromPolyline(gmapServices.streetviewPanorama.getPosition(), airportServices.placeGeneratedPath);

                if(near) {
                    var path = airportServices.generatedPath.slice(near.index, airportServices.generatedPath[airportServices.generatedPath.length - 1].index);
                    vm.etaToDest = airportUtils.computeETAByPath(path);
                }

                if(nearPlace) {
                    var placePath = airportServices.placeGeneratedPath.slice(nearPlace.index, airportServices.placeGeneratedPath[airportServices.placeGeneratedPath.length - 1].index);
                    vm.etaToPlace = airportUtils.computeETAByPath(placePath);
                }

                if(near || nearPlace) {
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                }
            });

            $rootScope.$on('recompute-main-path', function(e, p) {
                $scope.$apply(function(){
                    vm.etaToDest = airportUtils.computeETAByPath(p.path);
                });
            });

            $scope.$watch(function () {
                return vm.etaToDest;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) return;
                compueTotalETATime();
                // use to check validity to add place within remaining time
                $rootScope.etaToDest = newValue;
            });

            $scope.$watch(function () {
                return vm.etaToPlace;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) return;
                compueTotalETATime();
            });

            $scope.$watch(function(){
               return vm.timeRemaining.input;
            }, function(newValue, oldValue){
                if(newValue === oldValue) return;

                parseElapseTime(newValue);
            });
        }

        function compueTotalETATime () {
            vm.totalEta = vm.etaToDest + vm.etaToPlace;
        }

        function parseElapseTime (minutes) {
            if(angular.isDefined(timeElapseInterval)) $interval.cancel(timeElapseInterval);

            // copy minutes to timeRemaining.elapse
            vm.timeRemaining.elapse = angular.copy(minutes);
            vm.timeRemaining.elapseSeconds = timeUtils.convertMinToSec(vm.timeRemaining.elapse);
            vm.timeRemaining.elapseFormatted = timeUtils.formatElapseTime(vm.timeRemaining.elapseSeconds);

            $rootScope.elapseSeconds = vm.timeRemaining.elapseSeconds;
            console.log('parsing elapse time: ', vm.timeRemaining.elapseSeconds);

            // start countdown
            startElapseCountdown();
        }

        var etaToDestInSeconds;
        vm.dangerTimeRemaining = false;
        //var timeAllowanceWarning = timeUtils.convertMinToSec(timeUtils.timeAllowance);

        function startElapseCountdown () {
            vm.dangerTimeRemaining = false;

            // checks time every minute
            timeElapseInterval = $interval(function(){
                if(vm.timeRemaining.elapseSeconds > 0) {
                    vm.timeRemaining.elapseSeconds--;
                    vm.timeRemaining.elapse = timeUtils.convertSecToMin(vm.timeRemaining.elapseSeconds);
                    vm.timeRemaining.elapseFormatted = timeUtils.formatElapseTime(vm.timeRemaining.elapseSeconds);

                    $rootScope.elapseSeconds = vm.timeRemaining.elapseSeconds;

                    etaToDestInSeconds = timeUtils.convertMinToSec(vm.etaToDest);

                    if (vm.timeRemaining.elapseSeconds === (etaToDestInSeconds + timeUtils.timeAllowanceWarning)) {
                        alertServices.showGateReminder(vm.timeRemaining.elapseFormatted);
                    }
                    else if (etaToDestInSeconds === vm.timeRemaining.elapseSeconds) {
                        vm.dangerTimeRemaining = true;
                        alertServices.showGateWarning();
                    }
                } else {
                    // end interval
                    $interval.cancel(timeElapseInterval)
                }
            }, 1000);
        }

        /* Non Scope Functions here */

        function setTimeRemaining () {
            vm.showTimeRemainingInput = false;
        }

        function timeRemainingInputKeydown (event) {
            if(event.keyCode === 13) setTimeRemaining();
        }

    }
}());