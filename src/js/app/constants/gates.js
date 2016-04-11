(function () {
    'use strict';

    var gates = {
        1: {
            position: {lat: 37.37122352653642, lng: -121.93144954741001},
            heading: 135
        },
        2: {
            position: {lat: 37.37149370685669, lng: -121.9318887591362},
            heading: 26
        },
        3: {
            position: {lat: 37.37147079219274, lng: -121.93250834941864},
            heading: -21
        },
        4: {
            position: {lat: 37.371349823966995, lng: -121.93231858313084},
            heading: -107
        },
        5: {
            position: {lat: 37.371055129631536, lng: -121.93210937082767},
            heading: -149,
            pathIndex: [0, 63]
        },
        6: {
            position: {lat: 37.37077269093606, lng: -121.93185925483704},
            heading: -114,
            pathIndex: [0, 52]
        },
        7: {
            position: {lat: 37.37046893492584, lng: -121.93144954741001},
            heading: -151,
            pathIndex: [0, 43]
        },
        8: {
            position: {lat: 37.370170506770705, lng: -121.93118199706078},
            heading: -113,
            pathIndex: [0, 34]
        },
        9: {
            position: {lat: 37.369936026673116, lng: -121.93069852888584},
            heading: -145,
            pathIndex: [0, 19]
        },
        10: {
            position: {lat: 37.36962160902846, lng: -121.9303746521473},
            heading: -141,
            pathIndex: [0, 14]
        },
        11: {
            position: {lat: 37.36937380436299, lng: -121.93016476929188},
            heading: -131,
            pathIndex: [0, 7]
        },

        // AIRPORT_SOUTH_PATHS
        12: {
            position: {lat: 37.369007691456105, lng: -121.92978791892529},
            heading: -148,
            pathIndex: [0, 8]
        },
        13: {
            position: {lat: 37.36871725127072, lng: -121.92933596670628},
            heading: -98,
            pathIndex: [0, 17]
        },
        14: {
            position: {lat: 37.368539256179446, lng: -121.92903958261013},
            heading: -161,
            pathIndex: [0, 21]
        },
        15: {
            position: {lat: 37.36809852998939, lng: -121.92855812609196},
            heading: -136,
            pathIndex: [0, 43]
        },
        16: {
            position: {lat: 37.36769777067435, lng: -121.92810885608196},
            heading: -110,
            pathIndex: [0, 55]
        },
        17: {
            position: {lat: 37.36734657158914, lng: -121.92779034376144},
            heading: -81,
            pathIndex: [0, 70]
        },
        18: {
            position: {lat: 37.36714459140099, lng: -121.9275201112032},
            heading: -80,
            pathIndex: [0, 75]
        },
        19: {
            position: {lat: 37.36676461136759, lng: -121.92712649703026},
            heading: -149,
            pathIndex: [0, 85]
        },
        20: {
            position: {lat: 37.36646243793373, lng: -121.92678920924664},
            heading: -130,
            pathIndex: [0, 96]
        },
        21: {
            position: {lat: 37.366147472794665, lng: -121.92643247544765},
            heading: -126,
            pathIndex: [0, 106]
        },
        22: {
            position: {lat: 37.36584476393618, lng: -121.92608915269375},
            heading: -129,
            pathIndex: [0, 116]
        },
        23: {
            position: {lat: 37.3654269384352, lng: -121.92569956183434},
            heading: -126,
            pathIndex: [0, 128]
        },
        24: {
            position: {lat: 37.36509331589264, lng: -121.92538641393185},
            heading: -126,
            pathIndex: [0, 138]
        },
        25: {
            position: {lat: 37.3648375020757, lng: -121.92505717277527},
            heading: -134,
            pathIndex: [0, 148]
        },
        26: {
            position: {lat: 37.364524128961385, lng: -121.92472793161869},
            heading: -135,
            pathIndex: [0, 159]
        },
        27: {
            position: {lat: 37.36424219862963, lng: -121.92438460886478},
            heading: -130,
            pathIndex: [0, 169]
        },
        28: {
            position: {lat: 37.36394321275375, lng: -121.9239004701376},
            heading: -142
        }
    };

    angular.module('demoApp')
        .value('AIRPORT_GATES', gates);

}());