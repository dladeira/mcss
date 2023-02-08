const express = require('express')
const router = express.Router()
const bson = require('bson')
const socket = require('../socket')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')

const { removeCache } = require('../middleware/serverStats')

router.post('/stats-update', async (req, res) => {
    req.body.players = JSON.parse(req.body.players)
    const { cpu: cpuUsage, ram: ramUsage, players, messages, characters, whispers, commands, blocksBroken, blocksPlaced, blocksTraveled, deaths, secret, max_players } = req.body

    const server = await Server.findOne({ _id: secret })

    removeCache(server)

    if (!server)
        return res.status(404).send("Server not found")

    const user = await User.findOne({ _id: server.owner })
    const updateInterval = user.plan.updateFrequency * 1000
    const dataCount = await Data.countDocuments({ server: secret }).lean()
    const dataPackets = await Data.find({ server: secret }).skip(Math.floor(Math.random() * dataCount)).limit(20).lean()

    if (!server.firstUpdate) {
        server.firstUpdate = Date.now()
    }

    if (server.lastUpdate && Date.now() - (server.lastUpdate - (server.lastUpdate % (updateInterval))) < updateInterval) {
        const throttle = (updateInterval) - (Date.now() - (server.lastUpdate - (server.lastUpdate % (updateInterval))))
        // console.log("Throttle: " + throttle / 1000)
        return res.status(425).send("Throttle:" + throttle)
    }

    const storageUsage = getAverageDataSize(dataPackets) * dataCount / 1024 / server.storage * 100

    if (storageUsage / 1024 > server.storage)
        return res.status(429).send("No storage left")

    const data = new Data({
        owner: server.owner,
        server: server._id,
        cpuUsage,
        ramUsage,
        storageUsage,
        players: players,
        messages,
        characters,
        whispers,
        commands,
        blocksBroken,
        blocksPlaced,
        blocksTraveled,
        deaths,
        max_players,
        time: Date.now() - (Date.now() % (updateInterval)),
    })

    const sendIn = (updateInterval) - (Date.now() % (updateInterval))
    server.lastUpdate = Date.now()

    await server.save()
    await data.save()

    res.status(200).send("SendIn:" + sendIn)
})

router.post('/chat-msg', async (req, res) => {
    const { msg, secret, sender } = req.body

    const server = await Server.findOne({ _id: secret })

    if (!server)
        return res.status(404).send("Server not found")

    socket.sendChatMessage(server.owner, { msg, sender, server: server._id })
    return res.status(200).send("Success")
})

function getAverageDataSize(data) { // KiloBytes
    var total = 0
    for (var i = 0; i < data.length; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / data.length

    return averageSize / 1024
}

module.exports = router