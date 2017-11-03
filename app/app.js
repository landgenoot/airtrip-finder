const Koa = require('koa')
const router = require('./router')
const bodyparser = require('koa-bodyparser')
const app = new Koa()

app.use(bodyparser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => console.log('server started 3000'))
