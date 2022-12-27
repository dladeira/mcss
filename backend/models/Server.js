const mongoose = require('mongoose')

const serverSchema = new mongoose.Schema({
    name: String,
    type: String,
    bungeeInstance: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    storage: Number,
    owner: mongoose.ObjectId,
    firstUpdate: Number,
    lastUpdate: Number
})

const serverModel = mongoose.model("Server", serverSchema)

module.exports = serverModel