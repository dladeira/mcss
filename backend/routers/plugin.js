const express = require('express')
const router = express.Router()

const Server = require('../models/Server')

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
    req.body.time = Date.now()

    const { cpuUsage, ramUsage } = req.body

    const server = await Server.findOne({ _id: req.body.secret })

    if (!server)
        return res.status(400).send("Server not found")

    if (!server.data)
        server.data = []

    server.data.push({
        time: req.body.time,
        cpuUsage,
        ramUsage
    })

    await server.save()

    res.status(200).send()
})

module.exports = router