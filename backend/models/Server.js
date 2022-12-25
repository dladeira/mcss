const mongoose = require('mongoose')

const serverSchema = new mongoose.Schema({
    name: String,
    type: String,
    bungeeInstance: mongoose.ObjectId,
    storage: Number,
    owner: mongoose.ObjectId,
    data: [Object]
})

const serverModel = mongoose.model("Server", serverSchema)

module.exports = serverModel