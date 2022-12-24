const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Server = require('../models/Server')
const loggedIn = require('../middleware/loggedIn')

router.get('/get', loggedIn, async (req, res) => {
    const servers = await Server.find({ owner: req.user._id })

    res.status(200).json({ servers })
})

router.post('/new', loggedIn, async (req, res) => {
    const { serverName, serverType, bungeeInstance, storageAllocated } = req.body

    if (!serverName)
        return res.status(400).json({ error: "Server name not specified" })

    // if (serverType != "Regular")
    //     return res.status(400).json({error: "Invalid server type"})

    if (!storageAllocated || storageAllocated == 0 || isNaN(storageAllocated))
        return res.status(400).json({ error: "Invalid storage amount" })

    const existingServer = await Server.findOne({ name: serverName, owner: req.user._id })

    if (existingServer)
        return res.status(400).json({ error: "Name already in use" })

    const server = new Server({
        name: serverName,
        type: "regular",
        storageAllocated: storageAllocated,
        owner: req.user._id
    })
    await server.save()

    return res.status(200).json({ success: "Server created" })
})

router.post('/delete', loggedIn, async (req, res) => {
    const { name } = req.body

    await Server.deleteOne({ onwer: req.user._id, name: name })

    return res.status(200).json({})
})

module.exports = router