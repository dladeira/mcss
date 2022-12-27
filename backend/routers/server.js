const express = require('express')
const router = express.Router()
const bson = require('bson')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')

const loggedIn = require('../middleware/loggedIn')

const updateInterval = 10

router.post('/get', loggedIn, async (req, res) => {
    const servers = await Server.find({ owner: req.user._id }).lean()

    for (var server of servers) {
        const data = await Data.find({ server: server._id })
        // console.log("Size of " + server.name + " is " + getDataSize(data) + "KB")

        const graphs = {
            usage: {
                day: [],
                month: [],
                year: []
            }
        }
        const uptimeInfo = [0, 0]

        for (var i = 0; i < 24; i++) {
            graphs.usage.day.push({
                cpu: 0,
                ram: 0,
                storage: 0,
                count: 0
            })
        }

        for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(); i++) {
            graphs.usage.month.push({
                cpu: 0,
                ram: 0,
                storage: 0,
                count: 0
            })
        }

        for (var i = 0; i < 12; i++) {
            graphs.usage.year.push({
                cpu: 0,
                ram: 0,
                storage: 0,
                count: 0
            })
        }

        if (data.length > 0) {

            var latestData = data.reduce((prev, current) => prev.time > current.time ? prev : current)

            main:
            for (var i = server.firstUpdate; i < Date.now(); i += updateInterval * 1000) {
                for (dataPacket of data) {
                    if (dataPacket.time >= i && dataPacket.time <= i + updateInterval * 1000) {
                        var date = new Date(dataPacket.time)
                        var now = new Date()

                        if (date.getFullYear() == now.getFullYear()) {
                            graphs.usage.year[date.getMonth()].cpu += dataPacket.cpuUsage
                            graphs.usage.year[date.getMonth()].ram += dataPacket.ramUsage
                            graphs.usage.year[date.getMonth()].storage += dataPacket.storageUsage
                            graphs.usage.year[date.getMonth()].count += 1

                            if (date.getMonth() == now.getMonth()) {
                                graphs.usage.month[date.getDate()].cpu += dataPacket.cpuUsage
                                graphs.usage.month[date.getDate()].ram += dataPacket.ramUsage
                                graphs.usage.month[date.getDate()].storage += dataPacket.storageUsage
                                graphs.usage.month[date.getDate()].count += 1

                                if (date.getDate() == now.getDate()) {
                                    graphs.usage.day[date.getHours()].cpu += dataPacket.cpuUsage
                                    graphs.usage.day[date.getHours()].ram += dataPacket.ramUsage
                                    graphs.usage.day[date.getHours()].storage += dataPacket.storageUsage
                                    graphs.usage.day[date.getHours()].count += 1
                                }
                            }
                        }

                        uptimeInfo[0]++
                        continue main
                    }
                }
                if (date.getFullYear() == now.getFullYear()) {
                    graphs.usage.year[date.getMonth()].count += 1

                    if (date.getMonth() == now.getMonth()) {
                        graphs.usage.month[date.getDate()].count += 1

                        if (date.getDate() == now.getDate()) {
                            graphs.usage.day[date.getHours()].count += 1
                        }
                    }
                }

                uptimeInfo[1]++
            }

            const firstDateYear = new Date(server.firstUpdate)
            const firstDateMonth = new Date(server.firstUpdate)

            firstDateYear.setDate(1)
            firstDateYear.setHours(0)
            firstDateMonth.setHours(0)
            var skippedYear = Math.floor((server.firstUpdate - firstDateYear.getTime()) / (updateInterval * 1000))
            var skippedMonth = Math.floor((server.firstUpdate - firstDateMonth.getTime()) / (updateInterval * 1000))

            graphs.usage.year[firstDateYear.getMonth()].count += skippedYear
            graphs.usage.month[firstDateMonth.getDate()].count += skippedMonth

            server.stats = {
                cpuUsage: latestData.cpuUsage,
                ramUsage: latestData.ramUsage,
                storageUsage: Math.round(getDataSize(data) / (server.storage * 1024) * 100),
                uptime: Math.round(uptimeInfo[0] / (uptimeInfo[0] + uptimeInfo[1]) * 100),
                storageUsed: Math.ceil(getDataSize(data) / 1024 * 2) / 2,
                graphs
            }
        } else {
            server.stats = {
                cpuUsage: 0,
                ramUsage: 0,
                storageUsage: 0,
                uptime: 0,
                storageUsed: 0,
                graphs
            }
        }

        server.data = undefined
    }

    res.status(200).json({ servers })
})

router.post('/stats', loggedIn, async (req, res) => {
    const servers = await Server.find({ owner: req.user._id })

    const serverStats = []

    for (var server of servers) {
        var latestData
        if (!server.data || server.data.length <= 0)
            continue

        latestData = server.data.reduce((prev, current) => prev.time > current.time ? prev : current)

        serverStats.push({
            name: server.name,
            _id: server._id,
            cpuUsage: latestData.cpuUsage,
            ramUsage: latestData.ramUsage
        })
    }

    res.status(200).json({ stats: serverStats })
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

    const servers = await Server.find({ owner: req.user._id })


    var storageUsed = 0
    for (var server of servers) {
        storageUsed += server.storage
    }

    if (storageUsed + parseFloat(storageAllocated) > 10)
        return res.status(400).json({ error: `Not enough storage (${10 - storageUsed}MB left)` })

    if (existingServer)
        return res.status(400).json({ error: "Name already in use" })

    const newServer = new Server({
        name: serverName,
        type: "regular",
        storage: parseFloat(storageAllocated),
        owner: req.user._id
    })
    await newServer.save()

    return res.status(200).json({ success: "Server created" })
})

router.post('/delete', loggedIn, async (req, res) => {
    const { name } = req.body

    await Server.deleteOne({ onwer: req.user._id, name: name })

    return res.status(200).json({})
})

router.post('/update', loggedIn, async (req, res) => {
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

    const data = await Data.find({ server: foundServer._id })

    if (storageAllocated <= Math.ceil(getDataSize(data) / 1024 * 2) / 2)
        return res.status(400).json({ error: "Already used " + (Math.ceil(getDataSize(data) / 1024 * 2) / 2) + "MB of storage" })

    var storageUsed = 0
    for (var server of servers) {
        if (server._id != _id)
            storageUsed += server.storage
    }

    if (storageUsed + parseFloat(storageAllocated) > 10)
        return res.status(400).json({ error: `Not enough storage (${10 - storageUsed}MB left)` })

    if (existingServers.length > 1)
        return res.status(404).json({ error: "Name already in use" })

    foundServer.name = serverName
    foundServer.storage = parseFloat(storageAllocated)
    await foundServer.save()

    return res.status(200).json({ success: "Server saved" })
})

router.post('/delete', loggedIn, async (req, res) => {
    const { name } = req.body

    await Server.deleteOne({ onwer: req.user._id, name: name })

    return res.status(200).json({})
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