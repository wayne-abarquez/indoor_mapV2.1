(function(){
'use strict';

    var places = [
        // Starting From Gate 1
        {
            type: 'store',
            name: 'Sunset News',
            position: {lat: 37.3710524, lng: -121.93173360000003}
        },
        {
            type: 'store',
            name: 'Access Point',
            position: {lat: 37.3707253, lng: -121.93129069999998}
        },
        {
            type: 'food',
            name: 'Grab N Go',
            position: {lat: 37.3701053, lng: -121.93067539999998}
        },
        {
            type: 'store',
            name: 'Sunglass Icon',
            position: {lat: 37.3697693, lng: -121.92999250000003}
        },
        {
            type: 'store',
            name: 'InMotion',
            position: {lat: 37.3697346, lng: -121.92996929999998}
        },
        {
            type: 'store',
            name: 'InMotion Entertainment',
            position: {lat: 37.369717, lng: -121.92996340000002}
        },
        {
            type: 'store',
            name: 'Hicklebees',
            position: {lat: 37.3698053, lng: -121.92986710000002}
        },
        {
            type: 'store',
            name: 'Authors Bookstore',
            position: {lat: 37.3698059, lng: -121.92982189999998}
        },
        {
            type: 'store',
            name: 'CNN Newsstand',
            position: {lat: 37.3696457, lng: -121.92972370000001}
        },
        {
            type: 'store',
            name: 'Hudson News',
            position: {lat: 37.369603, lng: -121.9298111}
        },
        {
            type: 'food',
            name: 'Einstein Bros Bagels',
            position: {lat: 37.36963069999999, lng: -121.93005649999998}
        },
        {
            type: 'bar',
            name: 'Sip Savvy',
            position: {lat: 37.3696035, lng: -121.92999829999997}
        },
        {
            type: 'store',
            name: 'Red Mango',
            position: {lat: 37.3695808, lng: -121.92989239999997}
        },
        {
            type: 'food',
            name: 'Gordon Biersch Brewing Company',
            position: {lat: 37.3694546, lng: -121.92992800000002}
        },
        {
            type: 'store',
            name: 'Discover San Jose',
            position: {lat: 37.3693658, lng: -121.92981609999998}
        },
        {
            type: 'coffee',
            name: 'First class deli',
            position: {lat: 37.3693272, lng: -121.92972989999998}
        },
        {
            type: 'coffee',
            name: "Peet's Coffee & Tea",
            position: {lat: 37.3692853, lng: -121.92968780000001}
        },
        {
            type: 'food',
            name: 'Sora',
            position: {lat: 37.3693134, lng: -121.92980849999998}
        },
        {
            type: 'food',
            name: 'Tres Gringos Cabo Cantina',
            position: {lat: 37.36920569999999, lng: -121.92965600000002}
        },
        {
            type: 'food',
            name: 'Sonoma Chicken',
            position: {lat: 37.3692995, lng: -121.92935950000003}
        },
        {
            type: 'store',
            name: 'Blue Dot',
            position: {lat: 37.3692132, lng: -121.92932669999999}
        },
        {
            type: 'store',
            name: 'CNN News',
            position: {lat: 37.3691655, lng: -121.92933390000002}
        },
        {
            type: 'coffee',
            name: 'Starbucks',
            position: {lat: 37.36921299999999, lng: -121.92923080000003}
        },
        {
            type: 'food',
            name: 'Fresh Attractions',
            position: {lat: 37.3689633, lng: -121.92898450000001}
        },
        {
            type: 'bar',
            name: 'The Club at SJC',
            position: {lat: 37.3685391, lng: -121.92839400000003}
        },
        {
            type: 'atm',
            name: 'U.S.Bank ATM',
            position: {lat: 37.3684229, lng: -121.92840839999997}
        },
        {
            type: 'atm',
            name: 'U.S.Bank ATM',
            position: {lat: 37.3684079, lng: -121.92824239999999}
        },
        {
            type: 'currency_exchange',
            name: 'Foreign Currency Exchange',
            position: {lat: 37.3682352, lng: -121.92830939999999}
        },
        {
            type: 'bar',
            name: "Shark's Cage",
            position: {lat: 37.3672344, lng: -121.92691480000002}
        },
        {
            type: 'food',
            name: 'Pizza My Heart',
            position: {lat: 37.367263434691, lng: -121.9269709289074}
        },
        {
            type: 'store',
            name: "Menchie's Frozen Yogurt",
            position: {lat: 37.36710355578179, lng: -121.92697495222092}
        },
        {
            type: 'atm',
            name: 'U.S.Bank ATM',
            position: {lat: 37.3669384, lng: -121.92684170000001}
        },
        //{
        //    type: 'store',
        //    name: 'Firefly',
        //    position: {lat: 37.3669366, lng: -121.92673050000002}
        //},
        {
            type: 'food',
            name: 'Le Boulanger',
            position: {lat: 37.3669529, lng: -121.92661399999997}
        },
        {
            type: 'food',
            name: 'The Brit',
            position: {lat: 37.3668613, lng: -121.92653239999999}
        },
        {
            type: 'store',
            name: 'Sunset News',
            position: {lat: 37.3667208, lng: -121.92635630000001}
        },
        {
            type: 'store',
            name: 'CJ Olson',
            position: {lat: 37.3665451, lng: -121.92641349999997}
        },
        {
            type: 'store',
            name: 'Sunglass Icon',
            position: {lat: 37.3664996, lng: -121.9263621}
        },
        {
            type: 'store',
            name: 'Hudson Booksellers',
            position: {lat: 37.3663129, lng: -121.92591830000003}
        },
        {
            type: 'store',
            name: 'Discover San José',
            position: {lat: 37.3662213, lng: -121.92581630000001}
        },
        {
            type: 'food',
            name: 'Sushi Boat',
            position: {lat: 37.3662132, lng: -121.92579269999999}
        },
        {
            type: 'food',
            name: 'Una Mas',
            position: {lat: 37.36622847918345, lng: -121.92582495510578}
        },
        {
            type: 'food',
            name: 'Smashburger',
            position: {lat: 37.366079, lng: -121.92593979999998}
        },
        {
            type: 'coffee',
            name: 'Starbucks Coffee',
            position: {lat: 37.36602756186122, lng: -121.92588061094284}
        },
        {
            type: 'food',
            name: 'Brioche Doree Café',
            position: {lat: 37.3658617, lng: -121.92571529999998}
        },
        {
            type: 'bar',
            name: 'Santa Cruz Wine Bar',
            position: {lat: 37.3658617, lng: -121.92571529999998}
        },
        {
            type: 'food',
            name: 'The Soup and Salad Station',
            position: {lat: 37.3659219, lng: -121.92548679999999}
        },
        {
            type: 'food',
            name: 'Jamba Juice',
            position: {lat: 37.3658437, lng: -121.92541040000003}
        },
        {
            type: 'store',
            name: 'Hudson News',
            position: {lat: 37.3657283, lng: -121.92556719999999}
        },
        {
            type: 'atm',
            name: 'Bank of America ATM',
            position: {lat: 37.36574350541866, lng: -121.92542932927608}
        },
        {
            type: 'food',
            name: "San Jose Joe's",
            position: {lat: 37.365741, lng: -121.92530720000002}
        },
        {
            type: 'coffee',
            name: "Peet's Coffee & Tea",
            position: {lat: 37.3651985, lng: -121.9249964}
        },
        {
            type: 'store',
            name: 'Zipcar',
            position: {lat: 37.3649491, lng: -121.9246597}
        },
        {
            type: 'store',
            name: 'Hudson News',
            position: {lat: 37.3646043, lng: -121.9243204}
        },
        {
            type: 'food',
            name: 'Flames eatery and bar',
            position: {lat: 37.36451479999999, lng: -121.92399469999998}
        },
        {
            type: 'store',
            name: 'Best Buy Express Kiosk',
            position: {lat: 37.3644089, lng: -121.92382090000001}
        },
        {
            type: 'atm',
            name: 'Bank of America ATM',
            position: {lat: 37.36443885713914, lng: -121.92397087812424}
        },
    ];

    angular.module('demoApp')
        .value('AVERAGE_WALKING_TIME', 4) // 5 kph
        .value('AIRPORT_PLACES', places);
    ;

}());