const mongoose = require('mongoose')
const app = require('./app')
const dotenv = require('dotenv')
const argv = require('minimist')(process.argv.slice(2))

const port = argv["port"]

async function bootstrap() {
    dotenv.config()

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    await app.listen(port)
    console.log("--> DONE! Listening on port " + port)
}

bootstrap()