const bson = require('bson')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')
const updateInterval = 10

const cacheEnabled = true
const cacheLife = 60 * 1000

var cachedStats = []

async function serverStatsMw(req, res, next) {
    const servers = await Server.find({ owner: req.user._id }).lean()

    for (var server of servers) {
        const data = await Data.find({ server: server._id })
        if (data.length > 0) {
            var latestData = data.reduce((prev, current) => prev.time > current.time ? prev : current)

            server.stats = {
                live: {
                    cpuUsage: latestData.cpuUsage,
                    ramUsage: latestData.ramUsage,
                },
                cache: await loadCache(server, data)
            }
        } else {
            server.stats = {
                live: {
                    cpuUsage: 0,
                    ramUsage: 0,
                },
                cache: {
                    storageUsage: 0,
                    uptime: 0,
                    storageUsed: 0,
                    graphs: getDefaultGraphs()
                }
            }
        }
    }

    req.servers = servers
    next()
}

async function loadCache(server, data) {
    const cached = cachedStats.find(i => i.server.toString() == server._id.toString())
    if (cached && cacheEnabled) {
        if (cached.life > Date.now()) {
            console.log("VALID")
            return cached.cache
        } else {
            return await generateServerCache(server, data)
        }
    } else if (cacheEnabled) {
        return await generateServerCache(server, data)
    }
}

async function generateServerCache(server, data) {
    if (!data)
        data = await Data.find({ server: server._id })

    var latestData = data.reduce((prev, current) => prev.time > current.time ? prev : current)

    process.stdout.write('Cache GEN operation: ')

    cachedStats = cachedStats.filter(i => i.server.toString() != server._id.toString())

    const uptimeInfo = [0, 0]
    const graphs = getDefaultGraphs()
    const dataAge = [0, 0, 0] // [3m, 6m, 1y
    const dataSize = getDataSize(data)
    const averagePacket = getDataSize(data) / data.length

    var now = new Date()
    const month = 30 * 24 * 60 * 60 * 1000

    const promises = []

    for (var i = server.firstUpdate; i < Date.now(); i += updateInterval * 1000) {
        promises.push(registerPacketStats(i))
    }

    function registerToGraph(packet, graphTime, graphIndex) {
        graphs[graphTime][graphIndex].cpu += packet.cpuUsage
        graphs[graphTime][graphIndex].ram += packet.ramUsage
        graphs[graphTime][graphIndex].storage += packet.storageUsage
        graphs[graphTime][graphIndex].players += packet.players ? packet.players : 0
        graphs[graphTime][graphIndex].messages += packet.messages ? packet.messages : 0
        graphs[graphTime][graphIndex].whispers += packet.whispers ? packet.whispers : 0
        graphs[graphTime][graphIndex].dataCount += 1
        graphs[graphTime][graphIndex].count += 1
    }

    const deletePackets = []
    const players = []
    var dontdelete = 0

    async function registerPacketStats(time) {
        var date = new Date(time)
        const packet = await Data.findOne({ time: { $gt: time - 1, $lt: time + (updateInterval * 1000) + 1 } })

        if (packet) {
            if (now.getTime() - date.getTime() > server.dataLifetime * month) {
                deletePackets.push(packet._id)
            } else
                dontdelete++

            if (date.getUTCFullYear() == now.getUTCFullYear()) {
                registerToGraph(packet, 'year', date.getUTCMonth())

                if (date.getUTCMonth() == now.getUTCMonth()) {
                    registerToGraph(packet, 'month', date.getUTCDate())


                    if (date.getUTCDate() == now.getUTCDate()) {
                        registerToGraph(packet, 'day', date.getHours())

                    }
                }
            }

            main:
            for (var stats of packet.players) {
                for (var player of players) {
                    if (stats.uuid == player.uuid) {
                        player.username = stats.username
                        player.playtime += parseInt(stats.playtime) / 20
                        player.messages += parseInt(stats.messages)
                        continue main
                    }
                }
                const latestPlayer = latestData.players.find(i => i.uuid == stats.uuid)

                players.push({
                    uuid: stats.uuid,
                    username: stats.username,
                    playtime: parseInt(stats.playtime) / 20,
                    messages: parseInt(stats.messages),
                    location: latestPlayer ? latestPlayer.location : "---",
                    online: latestPlayer ? true : false
                })
            }

            const timeSince = now.getTime() - date.getTime()
            if (timeSince < 12 * month) {
                if (timeSince > 6 * month) {
                    dataAge[2]++
                } else if (timeSince > 3 * month) {
                    dataAge[1]++
                } else {
                    dataAge[0]++
                }
            }

            uptimeInfo[0]++
        } else {
            if (date.getUTCFullYear() == now.getUTCFullYear()) {
                graphs.year[date.getUTCMonth()].count += 1

                if (date.getUTCMonth() == now.getUTCMonth()) {
                    graphs.month[date.getUTCDate() - 1].count += 1

                    if (date.getUTCDate() == now.getUTCDate()) {
                        graphs.day[date.getUTCHours()].count += 1
                    }
                }
            }
            uptimeInfo[1]++
        }
    }

    await Promise.all(promises)

    await Promise.all(deletePackets.map(async packet => {
        await Data.deleteOne({ _id: packet })
    }))

    const firstDateYear = new Date(server.firstUpdate)
    const firstDateMonth = new Date(server.firstUpdate)

    firstDateYear.setDate(1)
    firstDateYear.setHours(0)
    firstDateMonth.setHours(0)
    var skippedYear = Math.floor((server.firstUpdate - firstDateYear.getTime()) / (updateInterval * 1000))
    var skippedMonth = Math.floor((server.firstUpdate - firstDateMonth.getTime()) / (updateInterval * 1000))

    graphs.year[firstDateYear.getMonth()].count += skippedYear
    graphs.month[firstDateMonth.getDate()].count += skippedMonth

    const cache = {
        storageUsage: Math.round(dataSize / (server.storage * 1024) * 100),
        storageUsed: Math.ceil(dataSize / 1024 * 10) / 10,
        uptime: Math.round(uptimeInfo[0] / (uptimeInfo[0] + uptimeInfo[1]) * 100),
        graphs,
        dataAge: {
            months3: Math.round((dataAge[0]) * averagePacket / 1024 * 10) / 10,
            months6: Math.round((dataAge[0] + dataAge[1]) * averagePacket / 1024 * 10) / 10,
            months12: Math.round((dataAge[0] + dataAge[1] + dataAge[2]) * averagePacket / 1024 * 10) / 10
        },
        players
    }

    cachedStats.push({
        cache,
        life: now.getTime() + cacheLife,
        server: server._id
    })

    console.log(`${Math.round((Date.now() - now) / 1000 * 10) / 10}s (${data.length} packets)`)

    return cache
}

function getDefaultGraphs() {
    const graphs = { day: [], month: [], year: [] }

    const defaultTime = {
        cpu: 0,
        ram: 0,
        storage: 0,
        players: 0,
        messages: 0,
        whispers: 0,
        count: 0,
        dataCount: 0
    }

    for (var i = 0; i < 24; i++)
        graphs.day.push({ ...defaultTime })

    for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(); i++)
        graphs.month.push({ ...defaultTime })

    for (var i = 0; i < 12; i++)
        graphs.year.push({ ...defaultTime })

    return graphs
}

function getDataSize(data) { // KiloBytes
    var total = 0
    var samples = 50
    for (var i = 0; i < samples; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / samples

    return averageSize * data.length / 1024
}

module.exports = {
    serverStatsMw,
    generateServerCache,
}