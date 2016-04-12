(function(){
'use strict';

angular.module('demoApp')
    .factory('airportServices', ['$rootScope', 'AIRPORT_GATES', 'AIRPORT_PATHS', 'AIRPORT_EXTENDED_PATHS',
        'AIRPORT_SOUTH_PATHS', 'RAW_EXTENDED_PATHS', 'PEOPLE_LOCATIONS', 'PEOPLE_HEATMAP_GRADIENT', '$timeout',
        'gmapServices', 'alertServices', 'airportUtils', airportServices]);

    function airportServices ($rootScope, AIRPORT_GATES, AIRPORT_PATHS, AIRPORT_EXTENDED_PATHS,
                              AIRPORT_SOUTH_PATHS, RAW_EXTENDED_PATHS, PEOPLE_LOCATIONS, PEOPLE_HEATMAP_GRADIENT, $timeout,
                              gmapServices, alertServices, airportUtils) {
        var service = {};

        var startPoint = {lat: 37.3693791, lng: -121.9297233},
            entranceMarker = null,
            airportPathPolyline = null
        ;

        var currentPosition = null,
            destination = null
        ;

        var computedPath = null,
            selectedGate = null;

        service.completePath = null;
        service.generatedPath = null;
        service.placeGeneratedPath = null;

        service.gatePath = null;

        service.placeStop = null;

        var placePosition = null;

        var defaultPitch = -7,
            directionsPathPolyline = null,
            //animationSpeedByMillis = 2000,
            animationSpeedByMillis = 500,
            pathCtr = 0,
            animationTimeout = null
        ;

        var placeAnimationTimeout = null;

        var placesDirectionsPathPolyline = null;

        service.gates = [];

        var arrivedAtPlace = false;

        service.peopleHeatmap = null;

        service.startPosition = null;
        service.stopAnimation = false;

        service.initialize = initialize;
        service.toggleGates = toggleGates;
        service.togglePeopleDensityHeatmap = togglePeopleDensityHeatmap;
        service.computeDirection = computeDirection;
        service.continueAnimation = continueAnimation;
        service.startMoving = startMoving;

        //var persons = [];

        function initialize () {
            gmapServices.defaultLatLng = startPoint;

            gmapServices.createMap('map-canvas');

            service.peopleHeatmap = gmapServices.loadHeatmap(PEOPLE_LOCATIONS, PEOPLE_HEATMAP_GRADIENT);

            loadPath();
            loadGates();

            $rootScope.$on('new-place-route', function(event, params){
                arrivedAtPlace = false;
                placePosition = params.placePosition;

                gmapServices.streetviewPanorama.setPosition(service.startPosition);
                service.placeGeneratedPath = computeDirection(service.startPosition, params.placePosition);

                placesDirectionsPathPolyline = showPath(service.placeGeneratedPath, placesDirectionsPathPolyline, '#2ebbb5');

                //update directionsPathPolyline
                gmapServices.hidePolyline(directionsPathPolyline);

                recomputeMainPath(params.placePosition);

                cancelAnimation(placeAnimationTimeout);
                cancelAnimation(animationTimeout);
                pathCtr = 0;
            });

            //gmapServices.addMapListener('click', function(e){
            //    var pos = e.latLng.toJSON();
            //    persons.push(pos);
            //    //console.log('Clicked Position: ', pos);
            //});
            //
            //$(document).keypress(function (e) {
            //    if (e.which == 32) {
            //        console.log('Persons: ', JSON.stringify(persons));
            //    } else if (e.which == 13) {
            //        persons = [];
            //        console.log('Persons: ', JSON.stringify(persons));
            //    }
            //});
        }

        function loadPath () {
            if (!airportPathPolyline) {
                //var extendedPaths = convertJsonToArray(AIRPORT_EXTENDED_PATHS);

                var firstPath = angular.copy(AIRPORT_PATHS).reverse();
                service.completePath = firstPath.concat(AIRPORT_SOUTH_PATHS);

                var paths = airportUtils.extractCoords(service.completePath),
                    opts = {strokeColor: '#00ff00', strokeOpacity: 0, strokeWeight: 1.5};

                airportPathPolyline = gmapServices.createCustomPolyline(paths, opts);
            }
        }

        /* Gates Functions */

        function loadGates () {
            entranceMarker = gmapServices.createCustomMarker(startPoint, 'images/markers/entrance.png');
            gmapServices.showMarker(entranceMarker);

            for (var gateNo in AIRPORT_GATES) {
                var gate = AIRPORT_GATES[gateNo];
                gate.gateNo = gateNo;

                gate.gateIcon = 'images/markers/gates/' + gateNo + '.png';

                var marker = gmapServices.createCustomMarker(gate.position, gate.gateIcon, {zIndex: 2});
                marker.gate = gate;
                marker.gateNo = gate.gateNo;

                gmapServices.addListener(marker, 'click', function () {
                    //if (animationTimeout) {
                    //    $timeout.cancel(animationTimeout);
                    //    animationTimeout = null;
                    //}
                    cancelAnimation(placeAnimationTimeout);
                    cancelAnimation(animationTimeout);
                    pathCtr = 0;

                    proceedGate(this.gate);

                    // broadcast to tell controller show 'Proceed' button
                    $rootScope.$broadcast('marker-clicked');
                    $rootScope.$broadcast('gate-clicked', {gateNo: this.gateNo});
                });

                service.gates.push(marker);
            }

            gmapServices.showMarkers(service.gates);
        }

        function proceedGate(gate) {
            service.placeStop = null;

            //console.log('proceed gate: ', gate);
            pathCtr = 0;
            computedPath = computePath(gate);

            currentPosition = gmapServices.streetviewPanorama.getPosition();
            destination = computedPath[computedPath.length - 1].position;

            service.startPosition = currentPosition;

            if(placesDirectionsPathPolyline && placesDirectionsPathPolyline.getMap()) {
                gmapServices.hidePolyline(placesDirectionsPathPolyline);
            }

            service.generatedPath = computeDirection(currentPosition, destination);
            // Show Polyline for paths
            directionsPathPolyline = showPath(service.generatedPath, directionsPathPolyline, '#2980b9');

            broadcastNavigation(gate, service.generatedPath);

            service.gatePath = angular.copy(service.generatedPath);

            gmapServices.setZoomIfGreater(20);

            selectedGate = gate;
            // start path animation
            //startAnimation(service.generatedPath, gate);
        }

        function startMoving () {
            if (placesDirectionsPathPolyline && !arrivedAtPlace) {
                startPlaceAnimation(service.placeGeneratedPath);
                return;
            }

            startAnimation(service.generatedPath, selectedGate);
        }

        function broadcastNavigation(gate, _path) {
            $rootScope.$broadcast('show-nearby-places', {path: _path});
            $rootScope.$broadcast('show-streetview-panel');
            //alertServices.proceedingToGate(gate.gateNo);
        }

        function computePath (gate) {
            var paths = [];
            if (gate.gateNo >= 1 && gate.gateNo <= 3) {
                paths = AIRPORT_EXTENDED_PATHS[gate.gateNo].slice(0);
            } else {
                var pathSrc = gate.gateNo >= 4 && gate.gateNo <= 11
                        ? AIRPORT_PATHS // paths 1 - 11 here
                        : AIRPORT_SOUTH_PATHS // paths 12 - 28 here
                    ;
                paths = gate.pathIndex
                    ? pathSrc.slice(gate.pathIndex[0], gate.pathIndex[1])
                    : pathSrc.slice(0) // this means it is the last path of the array
                ;
            }
            return paths;
        }

        function computeDirection (currentPosition, destination) {
            var currentPositionApprox = airportUtils.getPathFromPolyline(currentPosition, service.completePath),
                destinationApprox = airportUtils.getPathFromPolyline(destination, service.completePath)
            ;

            return destinationApprox.index <= currentPositionApprox.index
                            ? service.completePath.slice(destinationApprox.index + 1, currentPositionApprox.index + 2).reverse()
                            : service.completePath.slice(currentPositionApprox.index + 1, destinationApprox.index + 2)
            ;
        }

        function showPath (paths, polylineObj, color) {
            var pathsCoords = airportUtils.extractCoords(paths);

            if (polylineObj && polylineObj.getMap()) {
                polylineObj.setPath(pathsCoords);
            } else {
                polylineObj = gmapServices.createDashedPolyline(pathsCoords, color);
            }

            return polylineObj;
        }



        function startAnimation(paths, gate) {
            if (pathCtr >= paths.length) {
                pathCtr = 0;
                gmapServices.streetviewPanorama.setPov({
                    heading: gate.heading,
                    pitch: defaultPitch
                });
                // show alert
                $rootScope.$broadcast('arrived-at-gate', {gateNo: gate.gateNo});
                alertServices.arrivedOnGatePrompt(gate.gateNo);
                return;
            }

            var path = paths[pathCtr++];

            gmapServices.streetviewPanorama.setPosition(path.position);

            try {
                var nextPath = paths[pathCtr];
                var heading = path.heading
                        ? path.heading
                        : airportUtils.computeHeading(
                        path.position,
                        nextPath.position
                    );

                gmapServices.streetviewPanorama.setPov({
                    heading: heading,
                    pitch: defaultPitch
                });


                if (service.placeStop) {
                    var distance = airportUtils.computeDistance(
                        service.placeStop,
                        path.position
                    );

                    if (distance < 1) return;
                }

            } catch (err) {}

            animationTimeout = $timeout(function () {
                startAnimation(paths, gate);
            }, animationSpeedByMillis);
        }



        function startPlaceAnimation(paths) {
            if (pathCtr >= paths.length) {
                pathCtr = 0;
                $rootScope.$broadcast('arrived-at-place');
                arrivedAtPlace = true;
                return;
            }

            var path = paths[pathCtr++];
            gmapServices.streetviewPanorama.setPosition(path.position);
            arrivedAtPlace = false;

            try {
                var nextPath = paths[pathCtr];
                var heading = path.heading
                        ? path.heading
                        : airportUtils.computeHeading(
                        path.position,
                        nextPath.position
                    );

                gmapServices.streetviewPanorama.setPov({
                    heading: heading,
                    pitch: defaultPitch
                });


                if (service.placeStop) {
                    var distance = airportUtils.computeDistance(
                        service.placeStop,
                        path.position
                    );

                    if (distance < 1) return;
                }

            } catch (err) {}

            placeAnimationTimeout = $timeout(function () {
                startPlaceAnimation(paths);
            }, animationSpeedByMillis);
        }

        function continueAnimation() {
            if(animationTimeout) {
                $timeout.cancel(animationTimeout);
                startAnimation(service.generatedPath, selectedGate);
            }
        }

        function recomputeMainPath (placePosition) {
            service.generatedPath = computeDirection(placePosition, service.gatePath[service.gatePath.length - 1].position);
            directionsPathPolyline = showPath(service.generatedPath, directionsPathPolyline, '#2980b9');

            $rootScope.$broadcast('recompute-main-path', {path: service.generatedPath});
        }

        /* End Gates Functions */

        function toggleGates (hideMarker) {
            if (hideMarker) {
                gmapServices.hideMarkers(service.gates);
                gmapServices.hideMarker(entranceMarker);
                return;
            }

            gmapServices.showMarkers(service.gates);
            gmapServices.showMarker(entranceMarker);
        }

        function togglePeopleDensityHeatmap (hideHeatmap) {
            if (hideHeatmap) {
                gmapServices.hideHeatmap(service.peopleHeatmap);
                return;
            }

            gmapServices.showHeatmap(service.peopleHeatmap);
        }

        function cancelAnimation(animation){
            if (animation) $timeout.cancel(animation);
        }

        return service;
    }
}());