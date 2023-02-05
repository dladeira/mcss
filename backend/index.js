require('dotenv').config({ path: '../.env' })

const mongoose = require('mongoose')
const app = require('./app')
const socket = require('./socket')
const http = require('http')
const argv = require('minimist')(process.argv.slice(2))

const port = argv["port"]
let server

async function bootstrap() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')


    server = http.createServer(app)
    console.log("Created HTTP server")

    socket.setup(server)
    console.log("Created Socket.IO server")

    await server.listen(port)
    console.log("--> DONE! Listening on port " + port)
}

bootstrap()