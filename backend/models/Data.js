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
    storageUsage: Number,
    time: Number,
    players: [Object],
    max_players: Number,
    messages: Number,
    characters: Number,
    whispers: Number,
    commands: Number,
    blocksPlaced: Number,
    blocksBroken: Number,
    blocksTraveled: Number,
    itemsCrafted: Number,
    deaths: Number
})

const data = mongoose.model('Data', dataSchema)

module.exports = data