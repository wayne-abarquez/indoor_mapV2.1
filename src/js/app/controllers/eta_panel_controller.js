(function(){
'use strict';

angular.module('demoApp')
    .controller('etaPanelController', ['$scope', '$rootScope', '$interval', 'airportUtils', 'airportServices', '$mdDialog', 'gmapServices', 'alertServices', etaPanelController]);

    function etaPanelController ($scope, $rootScope, $interval, airportUtils, airportServices, $mdDialog, gmapServices, alertServices) {
        var vm = this;

        // shows warning when timeElapse is under the specified minutes
        var warningTimeInMinutes = 10;

        var timeElapseInterval, checkTimeRemainingInterval;
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
        vm.showDialog = showDialog;
        vm.setTimeRemaining = setTimeRemaining;
        vm.timeRemainingInputKeydown = timeRemainingInputKeydown;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-nearby-places', function (event, params) {
                vm.etaToDest = computeETA(params.path);
            });

            //$rootScope.$on('update-eta', function (event, params) {
            //    updateETA(params.addStops);
            //});

            $rootScope.$on('gate-clicked', function(e, p){
                $rootScope.$apply(function(){
                    vm.gateNo = p.gateNo;
                    vm.etaToPlace = null;
                    vm.placeName = '';
                });
            });

            $rootScope.$on('new-place-route', function (ev, params) {
                //airportServices.placeStop = params.stop;
               //initialETA = airportUtils.getPathFromPolyline(params.stop, airportServices.generatedPath[generatedPath.length-1].position);
                // update initalETA
                //var near = airportUtils.getPathFromPolyline(params.stop, airportServices.generatedPath);
                //if (near) {
                    //var path = airportServices.generatedPath.slice(near.index, airportServices.generatedPath[airportServices.generatedPath.length - 1].index);
                //$scope.$apply(function(){
                    vm.placeName = params.placeName;
                    vm.etaToPlace = computeETA(params.placePath);
                //});
                //}
            });

            gmapServices.streetviewPanorama.addListener('position_changed', function () {
                var near = airportUtils.getPathFromPolyline(gmapServices.streetviewPanorama.getPosition(), airportServices.generatedPath),
                    nearPlace = airportUtils.getPathFromPolyline(gmapServices.streetviewPanorama.getPosition(), airportServices.placeGeneratedPath);

                if(near) {
                    var path = airportServices.generatedPath.slice(near.index, airportServices.generatedPath[airportServices.generatedPath.length - 1].index);
                    vm.etaToDest = computeETA(path);
                }

                if(nearPlace) {
                    var placePath = airportServices.placeGeneratedPath.slice(nearPlace.index, airportServices.placeGeneratedPath[airportServices.placeGeneratedPath.length - 1].index);
                    vm.etaToPlace = computeETA(placePath);
                }

                if(near || nearPlace) {
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                }
            });

            $rootScope.$on('recompute-main-path', function(e, p) {
                $scope.$apply(function(){
                    vm.etaToDest = computeETA(p.path);
                });
            });


            $scope.$watch(function () {
                return vm.etaToDest;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) return;
                compueTotalETATime();
            });

            $scope.$watch(function () {
                return vm.etaToPlace;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) return;
                compueTotalETATime();
            });

            //$scope.$watchCollection(function(){
            //   return vm.stops;
            //}, updateStops);

            $scope.$watch(function(){
               return vm.timeRemaining.input;
            }, function(newValue, oldValue){
                if(newValue === oldValue) return;

                parseElapseTime(newValue);
            });
        }

        function compueTotalETATime () {
            vm.totalEta = vm.etaToDest + vm.etaToPlace;
            console.log('computing total eta time: ', vm.totalEta);
        }

        function convertSecToMin(sec) {
            return sec / 60;
        }

        function convertMinToSec(min) {
            return min * 60;
        }

        function formatElapseTime(timeElapseSeconds) {
            // format elapse to elapseFormatted MM:SS ex. 4:45
            var minDecimal = convertSecToMin(timeElapseSeconds);
            var timeArray = minDecimal.toString().split('.');

            var s = (minDecimal % 1);
            var seconds = Math.floor(s * 60);

            return {
                minutes: Math.floor(timeArray[0]).toString(),
                seconds: ('0' + seconds).slice(-2)
            };
        }

        function parseElapseTime (minutes) {
            if(angular.isDefined(timeElapseInterval)) $interval.cancel(timeElapseInterval);
            if(angular.isDefined(checkTimeRemainingInterval)) $interval.cancel(checkTimeRemainingInterval);

            // copy minutes to timeRemaining.elapse
            vm.timeRemaining.elapse = angular.copy(minutes);
            vm.timeRemaining.elapseSeconds = convertMinToSec(vm.timeRemaining.elapse);
            vm.timeRemaining.elapseFormatted = formatElapseTime(vm.timeRemaining.elapseSeconds);

            // start countdown
            startElapseCountdown();
        }

        function startElapseCountdown () {
            vm.timeRemaining.elapseSeconds = convertMinToSec(vm.timeRemaining.elapse);

            timeElapseInterval = $interval(function(){
                if(vm.timeRemaining.elapseSeconds > 0) {
                    vm.timeRemaining.elapseSeconds--;
                    vm.timeRemaining.elapse = convertSecToMin(vm.timeRemaining.elapseSeconds);
                    vm.timeRemaining.elapseFormatted = formatElapseTime(vm.timeRemaining.elapseSeconds);
                }
            }, 1000);

            // checks time every minute
            checkTimeRemainingInterval = $interval(function(){
                if((vm.timeRemaining.elapse - warningTimeInMinutes) < vm.totalEta) {
                    alertServices.showInsufficientTimeWarning(vm.timeRemaining.elapseFormatted);

                    if(vm.timeRemaining.elapseSeconds < 1) $interval.cancel(checkTimeRemainingInterval);
                }
            }, 60000);
        }

        /* Non Scope Functions here */

        function computeETA(path) {
            var distance = airportUtils.computeLength(airportUtils.extractAndCastCoords(path));
            //initialETA = airportUtils.computeTimeRaw(distance);
            //vm.etaToDest = initialETA;
            //vm.stops = [];
            //vm.etaDetail = '';
            return airportUtils.computeTimeRaw(distance);
        }

        //function updateETA (addStops) {
        //    vm.stops.push(addStops);
        //}

        //function updateStops (newValue) {
        //    if(newValue == 0) return;
        //
        //    vm.etaDetail = '';
        //
        //    var totalETA = 0;
        //    totalETA += initialETA;
        //
        //    vm.etaDetail += '<h3><b>'+ airportUtils.getFormattedTime(initialETA) +'</b></h3><br>';
        //
        //    newValue.forEach(function(place){
        //        totalETA += place.eta;
        //        vm.etaDetail += '<b>' + place.name + '</b>: '+ airportUtils.getFormattedTime(place.eta) + '<br>';
        //    });
        //
        //    vm.etaToDest = totalETA;
        //}


        function showDialog (ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('body')))
                    .clickOutsideToClose(true)
                    .title('ETA Detail')
                    .htmlContent(vm.etaDetail)
                    .ariaLabel('ETA Detail Dialog')
                    .ok('Close')
                    .targetEvent(ev)
            );
        }

        function setTimeRemaining () {
            vm.showTimeRemainingInput = false;
        }

        function timeRemainingInputKeydown (event) {
            //console.log('keyCode: ',event.keyCode);
            if(event.keyCode === 13) setTimeRemaining();
        }

    }
}());