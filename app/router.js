const router = require('koa-router')()
const tripfinder = require('../lib/tripfinder.js')

router.get('/', async ctx => {
  ctx.body = 'Airtrip finder API running'
})

router.get('/api/tripfinder', async ctx => {
  ctx.body = await tripfinder()
})

module.exports = router
