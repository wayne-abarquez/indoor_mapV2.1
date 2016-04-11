(function () {
    'use strict';

    angular
        .module('demoApp', ['ngMaterial', 'ngSanitize', 'ngAnimate', 'oitozero.ngSweetAlert', 'vAccordion'])

        .constant('BASE_URL', window.location.origin)

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('red')
                .accentPalette('pink');
        });

}());

