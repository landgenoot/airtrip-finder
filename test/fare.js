import test from 'ava'
import * as fare from '../lib/fare.js'

test('Convert fare object to EUR', async t => {
  let originalFare = {
    outbound: {
      price: {
        'value': 14.99,
        'valueMainUnit': '14',
        'valueFractionalUnit': '99',
        'currencyCode': 'GBP'
      }
    }
  }
  let expectedFare = {
    outbound: {
      price: {
        'value': 19.65,
        'valueMainUnit': '19',
        'valueFractionalUnit': '65',
        'currencyCode': 'EUR'
      }
    }
  }
  t.deepEqual(fare.toBase(originalFare, 'EUR'), expectedFare)
})

test('Convert unknow currency object to EUR', async t => {
  let originalFare = {
    outbound: {
      price: {
        'value': 14.99,
        'valueMainUnit': '14',
        'valueFractionalUnit': '99',
        'currencyCode': 'XYZ'
      }
    }
  }
  const error = t.throws(() => {
    fare.toBase(originalFare, 'EUR')
  })
  t.is(error, 'fx error')
})
