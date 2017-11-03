const request = require('request-promise')
const moment = require('moment')
const clone = require('clone')
const geolib = require('geolib')
const fx = require('./fx')

const stationsEndpoint = 'https://desktopapps.ryanair.com/v3/en-ie/res/stations'
const faresEndpoint = 'https://api.ryanair.com/farefinder/3/oneWayFares?&departureAirportIataCode={from}&language=en&limit=100&offset=0&outboundDepartureDateFrom={date}&outboundDepartureDateTo={date}&priceValueTo=50'

var stations

/**
 * Check if IATA is a valid Ryanair destination/origin
 * @param {String} IATA
 * @return {Boolean} true if valid
 */
const verifyAirport = IATA => {
  return IATA in stations
}

/**
 * Convert the Ryanair price object to EUR
 * @param {Object} price
 */
const convertCurrency = price => {
  if (price.currencyCode != 'EUR') {
    price = {
      value: fx.convert(price.value, { from: price.currencyCode, to: 'EUR' }),
      currencyCode: 'EUR'
    }
  }
  return price
}

/**
 * Connects to the public ryanair API and
 * implements the bread first searching algorithm
 * @param {Object} options
 * @return {Promise|Array} - trips found
 */
const run = async options => {
  stations = await request(options.stationsEndpoint)
  airports.forEach(IATA => {
    if (!verifyAirport(IATA)) {
      throw new Error(`${IATA} is not a valid destination/origin`)
    }
  })

  let findPromises = []
  for (airport of options.airports) {
    findPromises.push(
      findNext({
        lastAirport: airport,
        lastDate: moment(options.from),
        price: 0,
        distance: 0,
        legs: []
      }, options)
    )
  }
  return Promise.all(findPromises)
}

/**
 * Next iteration in trip search
 * @param {Object} trip - The current trip so far
 * @param {Object} options
 * @return {Promise|Trip}
 */
const findNext = (trip, options) => {
  return new Promise(async (resolve, reject) => {
    let findPromises = []
    let flights = await possibleFlights(trip.lastAirport, trip.lastDate, options)

    if (options.airports.includes(trip.lastAirport) && trip.legs.length > 0) {
      resolve(trip)
    } else {
      flights.forEach(flight => {
        flight.outbound.price = convertCurrency(flight.outbound.price)

        let updatedTrip = {
          lastAirport: flight.outbound.arrivalAirport.iataCode,
          lastDate: moment(flight.outbound.arrivalDate),
          price: trip.price + flight.outbound.price.value,
          distance: trip.distance + distance(flight),
          legs: clone(trip.hops).push(flight)
        }

        if (updatedTrip.price <= options.budget && updatedTrip.isBefore(options.to.add(1, 'day'))) {
          findPromises.push(findNext(updatedTrip))
        }
      })
      Promise.all(findPromises).then(resolve)
    }
  })
}

/**
 * Find the possible getaways from the current airport
 * @param {String} IATA
 * @param {Date} from
 * @param {Object} options
 */
const possibleFlights = async (IATA, from, options) => {
  let requestUrl = options.faresEndpoint
    .replace('{from}', IATA)
    .replace('{date}', date.format('YYYY-MM-DD'))
    .replace('{date}', date.add(options.maxStay, 'days').format('YYYY-MM-DD'))

  let result = await request(requestUrl)
  let flights = JSON.parse(result).fares

  // Filter impossible transfers
  return flights.filter(fare => from.add(options.transferTime, 'hours').isBefore(fare.outbound.departureDate))
}

/**
 * Calculates the travel distance of a flight
 * @param {Object} flight
 */
const distance = flight => {
  let departureAirport = stations[flight.departureAirport.iataCode]
  let arrivalAirport = stations[flight.arrivalAirport.iataCode]
  return geolib.getDistance(departureAirport, arrivalAirport)
}

module.exports = run

// prompt.start()

// var trips = []
// var destinatinons
// var properties
// var airports

// request(DESTINATIONS)
// .then(function (result) {
//   destinations = JSON.parse(result)
//   console.log('Lets find an airtrip!')

//   var promptschema = {
//     properties: {
//       date: {
//         description: 'Target departure date (DD-MM-YYYY)',
//         required: true,
//         default: '2016-02-01'
//       },
//       budget: {
//         description: 'Budget in EUR',
//         required: true,
//         default: '50'
//       },
//       airports: {
//         description: 'Departure/arrival airports (e.g. EIN, AMS, MST)',
//         type: 'string',
//         required: true,
//         default: 'EIN',
//         conform: function (input) {
//           var count = 0
//           var airports = input.split(',')
//           for (var i = 0; i < airports.length; i++) {
//             if (typeof (destinations.routes[airports[i].trim().toUpperCase()]) === 'undefined') {
//               console.log('error'.red + ':   Cannot find ' + airports[i].trim().toUpperCase() + ' in the Ryanair selector ')
//               return false
//             } else {
//               count++
//             }
//           }
//           return count > 0
//         }
//       }
//     }
//   }

//   prompt.get(promptschema, function (err, result) {
//     properties = result
//     airports = result.airports.split(',')

//     for (var i = 0; i < airports.length; i++) {
//       var trip = {
//         lastAirport: airports[i].trim().toUpperCase(),
//         lastDate: moment(result.date),
//         startAirport: airports[i].trim().toUpperCase(),
//         price: 0,
//         distance: 0,
//         hops: []
//       }
//       findNext(trip)
//     }
//   })
// })
// .catch(function (err) {
//   console.error(new Error('Cannot get routes from Ryanair: ' + err))
// })

// function findNext (trip) {
//   getFlights(trip.lastAirport, trip.lastDate, function (flights) {
//     for (var j in flights) {
//       var flight = flights[j].outbound

//       if (flight.price.currencyCode != 'EUR') {
//         flight.price.value = fx.convert(flight.price.value, {from: flight.price.currencyCode, to: 'EUR'})
//       }

//       if (trip.price + flight.price.value < properties.budget && trip.lastDate.isBefore(flight.departureDate)) {
//         var newTrip = {
//           lastAirport: flight.arrivalAirport.iataCode,
//           lastDate: moment(flight.arrivalDate),
//           price: trip.price + flight.price.value,
//           distance: trip.distance + getDistance(flight),
//           hops: clone(trip.hops)
//         }
//         newTrip.hops.push(flight)
//         if (airports.indexOf(newTrip.lastAirport) > -1) {
//           console.log()
//           console.log('--- € ' + newTrip.price + ', ' + newTrip.distance / 1000 + ' km, EUR/KM ' + newTrip.price / (newTrip.distance / 1000))
//           for (var k in newTrip.hops) {
//             console.log(newTrip.hops[k].departureAirport.name + ' ' + moment(newTrip.hops[k].departureDate).format('HH:mm') + ' - ' + newTrip.hops[k].arrivalAirport.name + ' ' + moment(newTrip.hops[k].arrivalDate).format('HH:mm'))
//           }
//         }
//         findNext(newTrip)
//       }
//     }
//   })
// }

// function getDistance (flight) {
//   var departureIata = flight.departureAirport.iataCode
//   var arrivalIata = flight.arrivalAirport.iataCode
//   for (var i in destinations.airports) {
//     if (destinations.airports[i].iataCode == departureIata) {
//       var departureAirport = destinations.airports[i]
//     }
//     if (destinations.airports[i].iataCode == arrivalIata) {
//       var arrivalAirport = destinations.airports[i]
//     }
//   }
//   return geolib.getDistance(departureAirport, arrivalAirport)
// }

// // function getFlights (from, date, cb) {
// //   var url = FARES
// //         .replace('{from}', from)
// //         .replace('{date}', date.format('YYYY-MM-DD'))
// //         .replace('{date}', date.format('YYYY-MM-DD'))

// //   request(url)
// //     .then(function (result) {
// //       var flights = JSON.parse(result).fares
// //       cb(flights)
// //     })
// // }
