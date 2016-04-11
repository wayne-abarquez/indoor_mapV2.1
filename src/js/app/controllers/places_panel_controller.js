(function(){
'use strict';

angular.module('demoApp')
    .controller('placesPanelController', ['$rootScope', '$q', 'placesServices', '$mdSidenav', 'gmapServices', 'airportUtils', placesPanelController]);

    function placesPanelController ($rootScope, $q, placesServices, $mdSidenav, gmapServices, airportUtils) {
        var vm = this;

        vm.placesList = {};

        vm.initialize = initialize;
        vm.getMdIcon = getMdIcon;
        vm.showPlaceDirections = showPlaceDirections;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-nearby-places', function(event, params){
                placesServices.clearPlacesPath();
                calculateNearbyPlaces(params.path)
                    .then(function(){
                        $mdSidenav('placesPanelSidenav')
                            .open();
                    });
            });

            //gmapServices.streetviewPanorama.addListener('position_changed', function () {
            //    var currentPosition = gmapServices.streetviewPanorama.getPosition();
            //    calculateNearbyFromPosition(currentPosition);
            //});
        }

        function showPlaceDirections (placeMarker) {
            gmapServices.triggerEvent(placeMarker, 'click');
        }

        //function calculateNearbyFromPosition(position) {
        //    vm.placesList = {};
        //
        //    // hide places markers
        //    gmapServices.hideMarkers(airportServices.places);
        //
        //    airportServices.places.forEach(function (place) {
        //        var distance = airportUtils.computeDistance(
        //            position,
        //            place.position
        //        );
        //
        //        // if distance within 15 meters
        //        if (distance <= 15) {
        //            if (!vm.placesList[place.type]) vm.placesList[place.type] = [];
        //
        //            var distanceFromStart = airportUtils.computeDistance(
        //                position,
        //                place.position
        //            );
        //
        //            if (!_.findWhere(vm.placesList[place.type], {name: place.name})) {
        //                // show marker
        //                gmapServices.showMarker(place);
        //
        //                //place.distance = distance.toFixed(1);
        //                place.etaTime = airportUtils.computeTime(distanceFromStart);
        //                vm.placesList[place.type].push(place);
        //            }
        //        }
        //    });
        //}

        function calculateNearbyPlaces (path) {
            // TODO: get all the nearby places along the list
            var dfd = $q.defer();
            var startingPosition = path[0].position;
            vm.placesList = {};

            // hide places markers
            gmapServices.hideMarkers(placesServices.places);

            placesServices.places.forEach(function(place){
                path.forEach( function(p){
                    var distance = airportUtils.computeDistance(
                        p.position,
                        place.position
                    );

                    if(distance <= 15) {
                        if (!vm.placesList[place.type]) vm.placesList[place.type] = [];

                        if( !_.findWhere(vm.placesList[place.type], {name: place.name})) {
                            // show marker
                            gmapServices.showMarker(place);

                            //place.distance = distance.toFixed(1);
                            place.etaTime = airportUtils.computeETA(startingPosition, place.position);
                            vm.placesList[place.type].push(place);
                        }
                    }
                });

                //console.log(type + ' place : ' + place.name + '\n Distance: ' + distance.toFixed(1) + ' meters');
            });

            dfd.resolve();

            return dfd.promise;
        }


        function getMdIcon(placeType) {
            return airportUtils.getPlaceIcon(placeType);
        }

    }
}());