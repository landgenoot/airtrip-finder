const fx = require('money')

fx.base = 'EUR'
fx.rates = {
  'GBP': 0.763020,
  'DKK': 0.640030,
  'SEK': 9.336421,
  'PLN': 4.442195,
  'EUR': 1
}

module.exports = fx
