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
 * @param {Object} fare
 */
const convertCurrency = fare => {
  if (fare.outbound.price.currencyCode !== 'EUR') {
    fare.outbound.price = {
      value: fx.convert(price.value, { from: fare.outbound.price.currencyCode, to: 'EUR' }),
      currencyCode: 'EUR'
    }
  }
  return fare
}

/**
 * Connects to the public ryanair API and
 * implements the bread first searching algorithm
 * @param {Object} options
 * @return {Promise|Array} - trips found
 */
const run = async options => {
  stations = await request(options.stationsEndpoint)
  options.airports.forEach(IATA => {
    if (!verifyAirport(IATA)) {
      throw new Error(`${IATA} is not a valid destination/origin`)
    }
  })

  let findPromises = []
  for (let airport of options.airports) {
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
      resolve(trip) // Roundtrip found
    } else {
      flights.forEach(flight => {
        let updatedTrip = {
          lastAirport: flight.outbound.arrivalAirport.iataCode,
          lastDate: moment(flight.outbound.arrivalDate),
          price: trip.price + flight.outbound.price.value,
          distance: trip.distance + distance(flight),
          legs: clone(trip.hops).push(flight)
        }

        if (updatedTrip.price <= options.budget && updatedTrip.isBefore(options.to.add(1, 'day'))) {
          findPromises.push(findNext(updatedTrip)) // Continue search
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

  // Filter impossible transfers and convert currency
  return flights
    .filter(fare => from.add(options.transferTime, 'hours').isBefore(fare.outbound.departureDate))
    .map(convertCurrency)
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
