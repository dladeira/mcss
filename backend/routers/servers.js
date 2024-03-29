const express = require('express')
const router = express.Router()
const bson = require('bson')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')

const loggedIn = require('../middleware/loggedIn')
const { serverStatsMw } = require('../middleware/serverStats')
const { verifyServer } = require('../socket')

var serversWaiting = []

router.post('/get', loggedIn(true), serverStatsMw, async (req, res) => {
    res.status(200).json({ servers: req.servers })
})

router.post('/plugin-register', async (req, res) => {
    var existingServer = await Server.findOne({ _id: req.body.secret })
    var waitingServer = serversWaiting.find(i => String(i._id) == req.body.secret)
    var server = existingServer ? existingServer : waitingServer

    if (!server)
        return res.status(400).send("Invalid server")

    if (waitingServer) {
        const userServers = await Server.find({ owner: waitingServer.owner })
        const user = await User.findOne({ _id: waitingServer.owner })

        if (userServers.length + 1 > user.plan.serverSlots)
            return res.status(400).json({ error: 'No more server slots' })

        verifyServer(waitingServer.owner, server._id)

        await waitingServer.save()
    }


    res.status(200).send(server.name)
})

router.post('/new', loggedIn(), async (req, res) => {
    const { serverName, serverType, bungeeInstance, storageAllocated } = req.body

    const userServers = await Server.find({ owner: req.user._id })

    if (userServers.length + 1 > req.user.plan.serverSlots)
        return res.status(400).json({ error: 'No more server slots' })

    if (!serverName)
        return res.status(400).json({ error: "Server name not specified" })

    // if (serverType != "Regular")
    //     return res.status(400).json({error: "Invalid server type"})

    if (!storageAllocated || storageAllocated == 0 || isNaN(storageAllocated))
        return res.status(400).json({ error: "Invalid storage amount" })

    const existingServer = await Server.findOne({ name: serverName, owner: req.user._id })

    const servers = await Server.find({ owner: req.user._id })


    var storageUsed = 0
    for (var server of servers) {
        storageUsed += server.storage
    }

    if (storageUsed + parseFloat(storageAllocated) > req.user.plan.maxStorage)
        return res.status(400).json({ error: `Not enough storage (${10 - storageUsed}MB left)` })

    if (existingServer)
        return res.status(400).json({ error: "Name already in use" })

    const newServer = new Server({
        name: serverName,
        type: "regular",
        storage: parseFloat(storageAllocated),
        owner: req.user._id,
        dataLifetime: 3,
        recentMessages: []
    })
    serversWaiting.push(newServer)

    return res.status(200).json({ success: "Server created", secret: newServer._id })
})

router.post('/delete', loggedIn(), async (req, res) => {
    const { _id } = req.body

    await Server.deleteOne({ owner: req.user._id, _id: _id })
    await Data.deleteMany({ server: req.body._id })

    return res.status(200).json({})
})

router.post('/update', loggedIn(), async (req, res) => {
    const { serverName, bungeeInstance, storageAllocated, _id } = req.body

    if (!serverName)
        return res.status(400).json({ error: "Server name not specified" })

    // if (serverType != "Regular")
    //     return res.status(400).json({error: "Invalid server type"})

    if (!storageAllocated || storageAllocated < 0.5 || isNaN(storageAllocated))
        return res.status(400).json({ error: "Invalid storage amount (minimum 0.5MB)" })

    const servers = await Server.find({ owner: req.user._id })
    const existingServers = await Server.find({ name: serverName, owner: req.user._id })
    const foundServer = await Server.findOne({ name: serverName, owner: req.user._id })

    if (!foundServer)
        return res.status(404).json({ error: "Server not found?" })

    const dataCount = await Data.countDocuments({ server: foundServer._id }).lean()
    const storageUsed = dataCount / 1024
    
    if (storageAllocated <= storageUsed)
        return res.status(400).json({ error: "Already used " + Math.round(storageUsed) + "MB of storage" })

    var totalStorageUsed = 0
    for (var server of servers) {
        if (server._id != _id)
            totalStorageUsed += server.storage
    }

    if (totalStorageUsed + parseFloat(storageAllocated) > req.user.plan.storage)
        return res.status(400).json({ error: `Not enough storage (${req.user.plan.storage - totalStorageUsed}MB left)` })

    if (existingServers.length > 1)
        return res.status(404).json({ error: "Name already in use" })

    foundServer.name = serverName
    foundServer.storage = parseFloat(storageAllocated)
    await foundServer.save()

    return res.status(200).json({ success: "Server saved" })
})

router.post('/delete', loggedIn(), async (req, res) => {
    const { name } = req.body

    await Server.deleteOne({ onwer: req.user._id, name: name })

    return res.status(200).json({})
})

router.post('/lifetime', loggedIn(), async (req, res) => {
    const { _id, lifetime } = req.body

    const server = await Server.findOne({ owner: req.user._id, _id: _id })

    if (lifetime > req.user.plan.maxDataLife)
        return res.status(400).json({ error: 'Over max' })

    if (!server)
        return res.status(404).json({ error: 'Server not found' })

    server.dataLifetime = lifetime
    await server.save()

    return res.status(200).json({ success: 'Server lifetime updated' })
})

module.exports = router