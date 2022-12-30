const express = require('express')
const router = express.Router()
const bson = require('bson')
const socket = require('../socket')

const Server = require('../models/Server')
const Data = require('../models/Data')

const updateInterval = 2

const { generateServerCache } = require('../middleware/serverStats')

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

    const { cpuUsage, ramUsage, players, messages, characters, whispers, commands, blocksBroken, blocksPlaced, blocksTraveled, deaths, secret } = req.body

    const server = await Server.findOne({ _id: secret })

    if (!server)
        return res.status(404).send("Server not found")

    const dataPackets = await Data.find({ server: secret })


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
        players: JSON.parse(players),
        time: Date.now(),
        messages,
        characters,
        whispers,
        commands,
        blocksBroken,
        blocksPlaced,
        blocksTraveled,
        deaths
    })

    const sendIn = (updateInterval * 1000) - (Date.now() % (updateInterval * 1000))
    server.lastUpdate = Date.now()

    await server.save()
    await data.save()

    res.status(200).send("SendIn:" + sendIn)

    generateServerCache(server)
})

router.post('/chat-msg', async (req, res) => {
    const { msg, secret, sender } = req.body

    const server = await Server.findOne({ _id: secret })

    if (!server)
        return res.status(404).send("Server not found")

    socket.sendChatMessage(server.owner, { msg, sender, server: server._id })
    return res.status(200).send("Success")
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