const fx = require('money')

fx.base = 'EUR'
fx.rates = {
  'GBP': 0.763020,
  'DKK': 0.640030,
  'SEK': 9.336421,
  'PLN': 4.442195,
  'EUR': 1
}

/**
 * Convert the Ryanair fare object to EUR
 * @param {Object} fare
 * @param {String} base currency
 */
const toBase = (fare, base) => {
  if (fare.outbound.price.currencyCode !== base) {
    let convertedValue = fx.convert(fare.outbound.price.value, { from: fare.outbound.price.currencyCode, to: base }).toFixed(2)
    fare.outbound.price = {
      currencyCode: base,
      value: convertedValue * 1,
      valueFractionalUnit: convertedValue.split('.')[1],
      valueMainUnit: convertedValue.split('.')[0]

    }
  }
  return fare
}

module.exports = {
  fx,
  toBase
}
