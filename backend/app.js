const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const argv = require('minimist')(process.argv.slice(2))

const authRouter = require('./routers/auth')
const serversRouter = require('./routers/servers')
const pluginRouter = require('./routers/plugin')

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/servers', serversRouter)
app.use('/plugin', pluginRouter)

module.exports = app