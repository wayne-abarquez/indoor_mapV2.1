(function(){
'use strict';

angular.module('demoApp')
    .factory('airportUtils', ['gmapServices', 'AVERAGE_WALKING_TIME', airportUtils]);

    function airportUtils (gmapServices, AVERAGE_WALKING_TIME) {
        var service = {};

        service.getFormattedTime = getFormattedTime;
        service.computeTimeRaw = computeTimeRaw;
        service.computeTime = computeTime;
        service.computeDistance = computeDistance;
        service.computeLength = computeLength;
        service.computeHeading = computeHeading;
        service.computeETARaw = computeETARaw;
        service.computeETA = computeETA;
        service.computeETAByDistance = computeETAByDistance;
        service.computeETAByPath = computeETAByPath;
        service.getPlaceIcon = getPlaceIcon;
        service.extractCoords = extractCoords;
        service.extractAndCastCoords = extractAndCastCoords;
        service.getPathFromPolyline = getPathFromPolyline;
        service.getNearestPointFromPath = getNearestPointFromPath;
        service.computeGeneratedPath = computeGeneratedPath;


        function getFormattedTime(time) {
            return time < 1
                ? (time * 60).toFixed(0) + ' sec'
                : time.toFixed(1) + ' mins'
                ;
        }

        function computeTimeRaw(distance) { //returns time in minutes
            var distanceKm = distance / 1000;
            var time = (distanceKm / AVERAGE_WALKING_TIME) * 60; // 60 minutes

            return time;
        }

        /*
         * params: distance in meters
         * time = distance / speed
         * return time in seconds
         */
        function computeTime(distance) {
            return getFormattedTime(computeTimeRaw(distance));
        }

        function computeDistance (point1, point2) {
            return google.maps.geometry.spherical.computeDistanceBetween(
                gmapServices.castLatLngLitToObj(point1),
                gmapServices.castLatLngLitToObj(point2)
            );
        }

        function computeLength (latLngArray) {
            return google.maps.geometry.spherical.computeLength(latLngArray);
        }

        function computeHeading (point1, point2) {
            return google.maps.geometry.spherical.computeHeading(
                gmapServices.castLatLngLitToObj(point1),
                gmapServices.castLatLngLitToObj(point2)
            );
        }

        function computeETARaw(point1, point2) {
            var distance = service.computeDistance(
                point1,
                point2
            );

            return service.computeTimeRaw(distance);
        }

        function computeETA (point1, point2) {
            var distance = service.computeDistance(
                point1,
                point2
            );

            return service.computeTime(distance);
        }

        function computeETAByDistance(distance) {
            return service.computeTimeRaw(distance);
        }

        function computeETAByPath (path) {
            var distance = computeLength(extractAndCastCoords(path));
            return computeTimeRaw(distance);
        }

        function getPlaceIcon(placeType) {
            switch (placeType) {
                case 'store':
                    return 'local_mall';
                case 'food':
                    return 'local_dining';
                case 'bar':
                    return 'local_bar';
                case 'coffee':
                    return 'local_cafe';
                case 'atm':
                    return 'local_atm';
                case 'currency_exchange':
                    return 'attach_money';

                //case 'store':
                //    return '&#xE54C;';
                //case 'food':
                //    return '&#xE556;';
                //case 'bar':
                //    return '&#xE540;';
                //case 'coffee':
                //    return '&#xE541;';
                //case 'atm':
                //    return '&#xE53E;';
                //case 'currency_exchange':
                //    return '&#xE227;';
            }
        }

        function extractCoords(paths) {
            var coordsArray = [];
            paths.forEach(function (path) {
                coordsArray.push(path.position);
            });
            return coordsArray;
        }

        function extractAndCastCoords(paths) {
            var coordsArray = [];
            paths.forEach(function (path) {
                coordsArray.push(gmapServices.castLatLngLitToObj(path.position));
            });
            return coordsArray;
        }

        function getPathFromPolyline(latLng, completePath) {
            var temp = {},
                last = {};

            if(!completePath) return

            completePath.forEach(function (pos, i) {
                if (i == 0) {
                    last.distance = service.computeDistance(
                        pos.position,
                        latLng
                    );
                    last.position = pos.position;
                    last.index = i;
                }

                var currentPos = completePath[i + 1];

                if (i < completePath.length - 1) {
                    temp.distance = service.computeDistance(
                        currentPos.position,
                        latLng
                    );
                    temp.position = currentPos.position;
                    temp.index = i;

                    if (temp.distance < last.distance) {
                        last = angular.copy(temp);
                    }
                }
                return;
            });

            return last;
        }

        function getNearestPointFromPath(position, path) {
            var nearest = getPathFromPolyline(position, path);

            return nearest.position;
        }

        function computeGeneratedPath(currentPosition, placePosition, completePath) {
            var currentPositionApprox = getPathFromPolyline(currentPosition, completePath),
                destinationApprox = getPathFromPolyline(placePosition, completePath)
                ;

            return destinationApprox.index <= currentPositionApprox.index
                ? completePath.slice(destinationApprox.index + 1, currentPositionApprox.index + 2).reverse()
                : completePath.slice(currentPositionApprox.index + 1, destinationApprox.index + 2)
                ;
        }

        return service;
    }
}());