(function(){
'use strict';

angular.module('demoApp')
    .factory('simulationServices', ['$rootScope', '$timeout', '$q', 'gmapServices', 'airportServices', simulationServices]);

    function simulationServices ($rootScope, $timeout, $q, gmapServices, airportServices) {
        var service = {};

         var infowindow = gmapServices.createInfoWindow(),
            gate7Position = {"lat": 37.37062979352191, "lng": -121.9312124040552}
         ;

         service.start = start;

        function start () {
            guyLanded()
                .then(function(){
                    showNextGate();
                });
        }

        // guy landed at gate 7
        function guyLanded() {
            var dfd = $q.defer();
            $timeout(function(){
                gmapServices.streetviewPanorama.setPosition(gate7Position);
                gmapServices.panTo(gate7Position);
                dfd.resolve();
            }, 100);

            return dfd.promise;
        }

        // show path to next gate for connecting flight
        function showNextGate() {
            var gate17Marker = _.findWhere(airportServices.gates, {gateNo: '17'});

            $timeout(function () {
                gmapServices.triggerEvent(gate17Marker, 'click');
                gmapServices.streetviewPanorama.addListener('position_changed', function () {
                    var mapBounds = gmapServices.map.getBounds(),
                        currentPosition = gmapServices.streetviewPanorama.getPosition()
                        ;
                    if (!mapBounds.contains(currentPosition)) gmapServices.panTo(currentPosition);
                });
            }, 300);
        }

        return service;
    }
}());