const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const authRouter = require('./routers/auth')
const serverRouter = require('./routers/server')
const pluginRouter = require('./routers/plugin')

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/servers', serverRouter)
app.use('/plugin', pluginRouter)

module.exports = app