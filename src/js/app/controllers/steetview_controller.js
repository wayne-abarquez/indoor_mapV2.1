(function(){
'use strict';

angular.module('demoApp')
    .controller('streetviewController', ['gmapServices', streetviewController]);

    function streetviewController (gmapServices) {
        var vm = this;

        vm.initialize = initialize;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            gmapServices.initializeStreetView('streetview-canvas');
        }
    }
}());