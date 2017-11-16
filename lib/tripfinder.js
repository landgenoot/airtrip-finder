const request = require('request-promise')
const moment = require('moment')
const clone = require('clone')
const geolib = require('geolib')
const fare = require('./fare')

const defaultOptions = {
  airports: ['SXF'],
  from: moment().add(3, 'months'),
  to: moment().add(3, 'months').add(7, 'days'),
  maxStay: 2,
  minTransfer: 2,
  stationsEndpoint: 'https://desktopapps.ryanair.com/v3/en-ie/res/stations',
  faresEndpoint: 'https://api.ryanair.com/farefinder/3/oneWayFares?&departureAirportIataCode={from}&language=en&limit=100&offset=0&outboundDepartureDateFrom={date}&outboundDepartureDateTo={date}&priceValueTo=50',
  baseCurrency: 'EUR',
  budget: 50
}

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
 * Connects to the public ryanair API and
 * implements the bread first searching algorithm
 * @param {Object} options
 * @return {Promise|Array} - trips found
 */
const run = async userOptions => {
  let options = Object.assign(defaultOptions, userOptions) // Overwrite with useroptions
  stations = JSON.parse(await request(options.stationsEndpoint))
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

  let result = ''
  trip.legs.forEach(leg => {
    result = result + ' ' + leg.outbound.departureAirport.iataCode
  })
  
  console.log(trip)
  console.log(result)
  return new Promise(async (resolve, reject) => {
    if (options.airports.includes(trip.lastAirport) && trip.legs.length > 0) {
      resolve(trip) // Roundtrip found
    } else {
      let findPromises = []
      let flights = await possibleFlights(trip.lastAirport, trip.lastDate, options)
      flights.forEach(flight => {
        let localLegs = trip.legs.slice()
        localLegs.push(flight)
        let updatedTrip = {
          lastAirport: flight.outbound.arrivalAirport.iataCode,
          lastDate: moment(flight.outbound.arrivalDate),
          price: trip.price + flight.outbound.price.value,
          distance: trip.distance + distance(flight),
          legs: localLegs
        }

        if (updatedTrip.price <= options.budget && updatedTrip.lastDate.isBefore(options.to.add(1, 'day'))) {
          findPromises.push(findNext(updatedTrip, options)) // Continue search
        }
      })
      Promise.all(findPromises).then(resolve).catch()
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
    .replace('{date}', from.format('YYYY-MM-DD'))
    .replace('{date}', clone(from).add(options.maxStay, 'days').format('YYYY-MM-DD'))

  let result = await request(requestUrl)
  let flights = JSON.parse(result).fares

  // Filter impossible transfers and convert currency
  return flights
    .filter(flight => clone(from).add(options.minTransfer, 'hours').isBefore(flight.outbound.departureDate))
    .map(flight => fare.toBase(flight, 'EUR'))
}

/**
 * Format lat lng Ryanair format to floats
 * @param {Object} rawStation
 */
const formatLatLng = rawStation => {
  let station = clone(rawStation)
  station.latitude = station.latitude.slice(0, -1) / 10000
  station.longitude = station.longitude.slice(0, -1) / 10000
  return station
}

/**
 * Calculates the travel distance of a flight
 * @param {Object} flight
 * @return {Number} distance in meters
 */
const distance = flight => {
  let departure = formatLatLng(stations[flight.outbound.departureAirport.iataCode])
  let arrival = formatLatLng(stations[flight.outbound.arrivalAirport.iataCode])
  return geolib.getDistance(departure, arrival)
}

run()

module.exports = {
  run
}
