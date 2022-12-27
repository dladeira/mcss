const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    server: {
        type: mongoose.ObjectId,
        ref: 'Server'
    },
    owner: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    cpuUsage: Number,
    ramUsage: Number,
    storageusage: Number,
    time: Number
})

const data = mongoose.model('Data', dataSchema)

module.exports = data