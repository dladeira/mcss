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

    const { cpuUsage, ramUsage } = req.body

    const server = await Server.findOne({ _id: req.body.secret })

    if (!server)
        return res.status(404).send("Server not found")

    const dataPackets = await Data.findOne({ server: req.body.secret })


    if (!server.firstUpdate) {
        server.firstUpdate = Date.now()
    }

    // console.log(Date.now() + ' - this update')
    // console.log((Date.now() - (Date.now() % (updateInterval * 1000))) + ' should have been')
    // console.log((Date.now() % (updateInterval * 1000)) + ' ms late')
    // console.log(server.lastUpdate % (updateInterval * 1000) + 'ms late last')

    if (server.lastUpdate && Date.now() - (server.lastUpdate - (server.lastUpdate % (updateInterval * 1000))) < updateInterval * 1000) {
        const throttle = (updateInterval * 1000) - (Date.now() - (server.lastUpdate - (server.lastUpdate % (updateInterval * 1000))))
        // console.log("Throttle: " + throttle)
        return res.status(425).send("Throttle:" + throttle)
    }

    const storageUsage = getDataSize(dataPackets)

    const data = new Data({
        owner: server.owner,
        server: server._id,
        cpuUsage,
        ramUsage,
        storageUsage,
        time: Date.now()
    })

    const sendIn = (updateInterval * 1000) - (Date.now() % (updateInterval * 1000))
    server.lastUpdate = Date.now()

    await server.save()
    await data.save()

    // console.log('Success: ' + sendIn)
    res.status(200).send("SendIn:" + sendIn)
})

function getDataSize(data) { // KiloBytes
    var total = 0
    var samples = 50
    for (var i = 0; i < samples; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / samples

    return averageSize * data.length / 1024
}

module.exports = router