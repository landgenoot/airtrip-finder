const router = require('koa-router')()

router.get('/', async ctx => {
  ctx.body = 'Airtrip finder running'
})

module.exports = router
