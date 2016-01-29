var request = require('request-promise');
var prompt = require('prompt');
var moment = require('moment');
var clone = require('clone');
var geolib = require('geolib');
var fx = require("money");

var DESTINATIONS = 'https://www.ryanair.com/en/api/2/forms/flight-booking-selector/';
var FARES = 'https://api.ryanair.com/farefinder/3/oneWayFares?&departureAirportIataCode={from}&language=en&limit=100&offset=0&outboundDepartureDateFrom={date}&outboundDepartureDateTo={date}&priceValueTo=50';
var DEPARTURE_RANGE = 7;
 
prompt.start();

var trips = [];
var destinations;
var properties;
var airports;

fx.base = "EUR";
fx.rates = {
	"GBP" : 0.763020,
    "DKK" : 0.640030,
    "SEK" : 9.336421,
    "PLN" : 4.442195,
    "EUR" : 1,
	/* etc */
}

request(DESTINATIONS)
.then(function (result) {
    destinations = JSON.parse(result);
    console.log('Lets find an airtrip!');
    
    var promptschema = {
        properties: {
            date: {
              description: 'Target departure date (DD-MM-YYYY)',
              required: true,
              default: '2016-02-01'
            },
            budget: {
              description: 'Budget in EUR',
              required: true,
              default: '50',
            },
            airports: {
              description: 'Departure/arrival airports (e.g. EIN, AMS, MST)',
              type: 'string',
              required: true,
              default: 'EIN',
              conform: function(input) {
                  var count = 0;
                  var airports = input.split(',');
                  for (var i = 0; i < airports.length; i++) {
                      if (typeof(destinations.routes[airports[i].trim().toUpperCase()]) == 'undefined') {
                          console.log('error'.red + ':   Cannot find ' +  airports[i].trim().toUpperCase() + ' in the Ryanair selector ')
                          return false;
                      } else {
                          count++;
                      }
                  }
                  return count > 0;
              },
            }
        }
    };

    prompt.get(promptschema, function (err, result) {
        properties = result;
        airports = result.airports.split(',');
        
        for (var i = 0; i < airports.length; i++) {
            var trip = {
                lastAirport: airports[i].trim().toUpperCase(),
                lastDate: moment(result.date),
                startAirport: airports[i].trim().toUpperCase(),
                price: 0,
                distance: 0,
                hops: []
            }
            findNext(trip);
        }
    });
    
})
.catch(function (err) {
    console.error(new Error('Cannot get routes from Ryanair: '+err));
});

function findNext(trip) {
        getFlights(trip.lastAirport, trip.lastDate, function(flights) {
            for (var j in flights) {
                var flight = flights[j].outbound
                
                if (flight.price.currencyCode != 'EUR') {
                    flight.price.value = fx.convert(flight.price.value, {from: flight.price.currencyCode, to: "EUR"});
                }
                
                if (trip.price + flight.price.value < properties.budget && trip.lastDate.isBefore(flight.departureDate)) {
                    var newTrip = {
                        lastAirport: flight.arrivalAirport.iataCode,
                        lastDate: moment(flight.arrivalDate),
                        price: trip.price + flight.price.value,
                        distance: trip.distance + getDistance(flight),
                        hops: clone(trip.hops)
                    }
                    newTrip.hops.push(flight);
                    if (airports.indexOf(newTrip.lastAirport) > -1) {
                        console.log();
                        console.log('--- € ' + newTrip.price + ', ' + newTrip.distance/1000 + ' km, EUR/KM ' + newTrip.price/(newTrip.distance/1000));
                        for (var k in newTrip.hops) {
                            console.log(newTrip.hops[k].departureAirport.name + ' ' + moment(newTrip.hops[k].departureDate).format("HH:mm") + ' - ' + newTrip.hops[k].arrivalAirport.name  + ' ' + moment(newTrip.hops[k].arrivalDate).format("HH:mm"));
                        }
                    }
                    findNext(newTrip);
                }
            }
        })
    
}

function getDistance(flight) {
    var departureIata = flight.departureAirport.iataCode;
    var arrivalIata = flight.arrivalAirport.iataCode;
    for (var i in destinations.airports) {
        if (destinations.airports[i].iataCode == departureIata) {
            var departureAirport = destinations.airports[i];
        }
        if (destinations.airports[i].iataCode == arrivalIata) {
            var arrivalAirport = destinations.airports[i];
        }
    }
    return geolib.getDistance(departureAirport, arrivalAirport);
}

function getFlights(from, date, cb) {
    var url = FARES
        .replace('{from}', from)
        .replace('{date}', date.format('YYYY-MM-DD'))
        .replace('{date}', date.format('YYYY-MM-DD'));
        
    request(url)
    .then(function(result) {
        var flights = JSON.parse(result).fares;
        cb(flights);
    });
}
