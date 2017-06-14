/* jshint esversion: 6 */

let express = require('express');
let router = express.Router();

let rawdata = require('../data.json');
let countries = {};


// Data structures
// ---------------
// Country
//   code: string
//   name: string
//   states: array of State
//
// State
//   code: string
//   name: string
//   cities: array of string
//
// Countries : dict <key: Country.code, value: Country>


rawdata.forEach( function(e) {

    if (! (e[3] in countries) && e[3] != 'LU') {
        countries[e[3]] = {
            code: e[3],
            name: e[4],
            states: {}
        };
    }

    if (e[3] != 'LU') {

        if (! (e[1] in countries[e[3]].states)) {
            countries[e[3]].states[e[1]] = {
                code: e[1],
                name: e[2],
                cities: []
            };
        }

        countries[e[3]].states[e[1]].cities.push( e[0] );
    }
});


router.get('/dump', function(req, res, next) {
    res.type('json');
    res.send(countries);
});

// Return a list of countries
router.get('/countries', function(req, res, next) {
    let result = {data: []};

    res.type('json');

    for (let key in countries) {
        result.data.push({code: key, name: countries[key].name});
    }

    res.send(result);
});


// Return all the data for a country
router.get('/country/:id', function(req, res, next) {
    let result;
    res.type('json');

    if ( countries.hasOwnProperty(req.params.id) ) {
        result = {data: countries[req.params.id]};
    } else {
        result = {error: 'Invalid country code.'};
    }

    res.send(result);
});


router.get('/country/:id/states', function(req, res, next) {
    let result;
    let states;
    res.type('json');

    if ( countries.hasOwnProperty(req.params.id) ) {
        result = {data: []};
        states = countries[req.params.id].states;
        for (let s in states) {
            result.data.push({code: states[s].code, name: states[s].name});
        }
    } else {
        result = {error: 'Invalid country code.'};
    }

    res.send(result);
});


router.get('/cities/:countryId/:stateId', function(req, res, next) {
    let result;
    let values;

    let countryCode = req.params.countryId;
    let stateCode = req.params.stateId;

    res.type('json');

    if (! countries.hasOwnProperty(countryCode) ) {
        result = {error: 'Invalid country code.'};
    } else if (! countries[countryCode].states.hasOwnProperty(stateCode) ) {
        result = {error: 'Invalid state code.'};
    } else {
        result = {data: countries[countryCode].states[stateCode].cities};
    }

    res.send(result);
});


// Users for demo
let users = [{
    id: 1,
    firstname: 'John', lastname: 'Doe',
    country: 'NL', state: 'NH', city: 'Aalsmeerderbrug'
},{
    id: 2,
    firstname: 'Jane', lastname: 'Doe',
    country: 'BE', state: 'LK', city: 'Ans'
},{
    id: 3,
    firstname: 'Ben', lastname: 'Dover',
    country: 'NL', state: 'ZL', city: 'Axel'
},{
    id: 4,
    firstname: 'Tom', lastname: 'Peter',
    country: 'NL', state: 'DR', city: 'Aalden'
},{
    id: 5,
    firstname: 'Random', lastname: 'Name',
    country: 'BE', state: 'NA', city: 'Yvoir'
}


];

router.get('/users/dump', function(req, res, next) {
    let result;
    res.type('json');
    res.send({data: users});
});


module.exports = router;

