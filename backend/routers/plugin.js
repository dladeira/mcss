const express = require('express')
const router = express.Router()
const bson = require('bson')

const Server = require('../models/Server')
const Data = require('../models/Data')

const updateInterval = 10

router.post('/server', async (req, res) => {
    let server

    try {
        server = await Server.findOne({ _id: req.body.secret })
    } catch { }

    if (!server)
        return res.status(400).send("Invalid server")

    res.status(200).send(server.name)
})

router.post('/stats-update', async (req, res) => {

    const { cpuUsage, ramUsage, players, messages, whispers } = req.body

    const server = await Server.findOne({ _id: req.body.secret })

    if (!server)
        return res.status(404).send("Server not found")

    const dataPackets = await Data.find({ server: req.body.secret })


    if (!server.firstUpdate) {
        server.firstUpdate = Date.now()
    }

    if (server.lastUpdate && Date.now() - (server.lastUpdate - (server.lastUpdate % (updateInterval * 1000))) < updateInterval * 1000) {
        const throttle = (updateInterval * 1000) - (Date.now() - (server.lastUpdate - (server.lastUpdate % (updateInterval * 1000))))
        // console.log("Throttle: " + throttle)
        return res.status(425).send("Throttle:" + throttle)
    }

    const storageUsage = getStorageUsage(dataPackets, server.storage)

    const data = new Data({
        owner: server.owner,
        server: server._id,
        cpuUsage,
        ramUsage,
        storageUsage,
        players,
        time: Date.now(),
        messages,
        whispers
    })

    const sendIn = (updateInterval * 1000) - (Date.now() % (updateInterval * 1000))
    server.lastUpdate = Date.now()

    await server.save()
    await data.save()

    // console.log('Success: ' + sendIn)
    res.status(200).send("SendIn:" + sendIn)
})

function getStorageUsage(data, storage) { // KiloBytes
    var total = 0
    var samples = 50
    for (var i = 0; i < samples; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / samples

    return Math.round(averageSize * data.length / 1024 / (storage * 1024) * 100)
}

module.exports = router