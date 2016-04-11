(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', '$scope', '$timeout', '$mdSidenav', 'gmapServices', 'airportServices', 'placesServices', 'simulationServices', gmapController]);

    function gmapController($rootScope, $scope, $timeout, $mdSidenav, gmapServices, airportServices, placesServices, simulationServices) {
        var vm = this;

        vm.hideMarkers = false;
        vm.hideHeatmap = true;
        vm.showStreetview = false;
        vm.showPlacesBtn = false;
        vm.showEtaPanel = false;

        vm.showProceedButton = false;

        vm.initialize = initialize;
        vm.showPlacesList = showPlacesList;
        vm.triggerProceedGate = triggerProceedGate;
        vm.showStreetviewPanel = showStreetviewPanel;
        vm.closePlacesList =  closePlacesList;

        vm.proceedToDirection = proceedToDirection;

        vm.initialize();

        function initialize () {
            airportServices.initialize();

            placesServices.loadPlaces();

            //$scope.$watch(function(){
            //    return vm.hideMarkers;
            //}, function (newValue, oldValue) {
            //    if(newValue === oldValue) return;
            //
            //    airportServices.toggleGates(newValue);
            //});

            $scope.$watch(function () {
                return vm.hideHeatmap;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) return;

                airportServices.togglePeopleDensityHeatmap(newValue);
            });

            $rootScope.$on('show-streetview-panel', function () {
                showStreetviewPanel();
                vm.showEtaPanel = true;
            });

            // Close Streetview, triggers from a custom control on gmapServices
            $rootScope.$on('close-streetview', function(){
                hideStreetviewPanel();
            });

            $rootScope.$on('new-place-route', function (ev, params) {
                //airportServices.continueAnimation();
                //airportServices.placeStop = params.stop;

                vm.showProceedButton = true;
            });

            $rootScope.$on('marker-clicked', function(){
                vm.showProceedButton = true;
            });

            $rootScope.$on('arrived-at-place', function(){
                vm.showProceedButton = true;
            });


            simulationServices.start();

            //gmapServices.addMapListener('click', function(e){
            //    console.log('Position Clicked: ', e.latLng.toJSON());
            //});
        }

        function showPlacesList() {
            $mdSidenav('placesPanelSidenav')
                .open()
                .then(function(){
                    vm.showPlacesBtn = false;
                });
        }

        function triggerProceedGate (gate, event) {
            $mdSidenav('gateListSideNav')
                .close()
                .then(function(){
                    gmapServices.triggerEvent(gate, 'click');
                });
        }

        /* Streetview Functions */

        function showStreetviewPanel () {
            if(!vm.showStreetview) {
                vm.showStreetview = true;

                $timeout(function () {
                    google.maps.event.trigger(gmapServices.streetviewPanorama, 'resize');
                }, 100);
            }
        }

        function hideStreetviewPanel() {
            if (vm.showStreetview) {
                $scope.$apply(function () {
                    vm.showStreetview = false;
                });
            }
        }

        function closePlacesList () {
            $mdSidenav('placesPanelSidenav')
                .close()
                .then(function(){
                    vm.showPlacesBtn = true;
                });
        }

        function proceedToDirection () {
            airportServices.startMoving();
            vm.showProceedButton = false;
        }

        /* End of Streetview Functions */
    }
}());