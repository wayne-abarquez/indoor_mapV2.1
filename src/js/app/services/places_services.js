(function(){
'use strict';

angular.module('demoApp')
    .factory('placesServices', ['$rootScope', 'gmapServices', 'AIRPORT_PLACES', 'airportServices', 'airportUtils', 'timeUtils', 'alertServices', placesServices]);

    function placesServices ($rootScope, gmapServices, AIRPORT_PLACES, airportServices, airportUtils, timeUtils, alertServices) {
        var service = {};

        service.places = [];

        service.markerGeneratedPath = {
            path: [],
            polyline: null
        };

        service.lastPlacePolyline = null;


        var placeInfowindow = gmapServices.createInfoWindow('');

        service.loadPlaces = loadPlaces;
        service.clearPlacesPath = clearPlacesPath;

        function loadPlaces() {
            AIRPORT_PLACES.forEach(function (place) {
                var icon = 'images/markers/poi/' + place.type + '.png';
                var marker = gmapServices.createCustomMarker(place.position, icon, {zIndex: 1});
                marker.type = place.type;
                marker.name = place.name;

                marker.polyline = computePlacePath(place.position);
                marker.stopPosition = marker.polyline.getPath().getAt(0);

                gmapServices.addListener(marker, 'click', function () {
                    //placeInfowindow.setContent(createPlaceContent(place));
                    //gmapServices.showInfoWindow(placeInfowindow, marker);
                    var _placePosition = marker.getPosition();
                    service.markerGeneratedPath.path = computeGeneratedPath(airportServices.startPosition, _placePosition);
                    var etaToPlace = airportUtils.computeETAByPath(service.markerGeneratedPath.path);

                    // Check if can add place within time remaining
                    var etaToPlaceInSeconds = timeUtils.convertMinToSec(etaToPlace);
                    var etaToDestInSeconds = timeUtils.convertMinToSec($rootScope.etaToDest - etaToPlace);
                    var totalETASeconds = etaToDestInSeconds + etaToPlaceInSeconds;
                    console.log('elapseSeconds: '+ $rootScope.elapseSeconds+' totalETASeconds: '+totalETASeconds);
                    //console.log('$rootScope.etaToDest: '+ $rootScope.etaToDest+ ' etaToPlace: '+ etaToPlace);
                    if($rootScope.elapseSeconds <= totalETASeconds) {
                        alertServices.showCannotAddPlace(marker.name, Math.floor(timeUtils.convertSecToMin($rootScope.elapseSeconds)));
                        return;
                    }

                    if (service.lastPlacePolyline) gmapServices.hidePolyline(service.lastPlacePolyline);

                    service.lastPlacePolyline = marker.polyline;

                    gmapServices.panTo(_placePosition);
                    gmapServices.showPolyline(marker.polyline);

                    $rootScope.$broadcast('new-place-route', {stop: marker.stopPosition, placePosition: _placePosition, placeName: marker.name, placePath: service.markerGeneratedPath.path, eta: etaToPlace});

                    // proceed to place
                    //      * get the nearest latlng attached to the path (polyline)
                    // update eta to gate
                    $rootScope.$broadcast('update-eta', {addStops:  {name: marker.name, position: _placePosition, eta: marker.polyline.eta}});
                });

                service.places.push(marker);
            });
        }

        function clearPlacesPath () {
            service.places.forEach(function(place){
               gmapServices.hidePolyline(place.polyline);
            });
        }

        function computePlacePath (placePosition) {
            var nearestPoint = airportUtils.getNearestPointFromPath(placePosition, airportServices.completePath);
            //var near = gmapServices.createLetterMarker('A');
            //near.setPosition(nearestPoint);

            var polyline = gmapServices.createDashedPolyline([nearestPoint, placePosition], '#2ebbb5');
            gmapServices.hidePolyline(polyline);

            polyline.eta = airportUtils.computeETARaw(nearestPoint, placePosition);

            return polyline;
        }

        function computeGeneratedPath(currentPosition, placePosition) {
            return airportUtils.computeGeneratedPath(currentPosition, placePosition, airportServices.completePath);
        }

        function createPlaceContent(place) {
            var content = '<h2 style="margin:0px;"><b>' + place.name + '</b></h2>';
            content += '<p style="text-align:center;color:#95a5a6;font-weight:600;text-transform: uppercase;margin:0px;">' + place.type + '</p>';

            return content;
        }

        return service;
    }
}());