const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const authRouter = require('./routers/auth')

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/auth', authRouter)

module.exports = app