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

    res.status(200).json({})
})

module.exports = router