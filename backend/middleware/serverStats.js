const bson = require('bson')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')
const updateInterval = 10

const cacheEnabled = true
const cacheLife = 30 * 1000

var cachedStats = []

async function middleware(req, res, next) {
    const servers = await Server.find({ owner: req.user._id }).lean()
    const start = Date.now()

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
                    graphs: {
                        usage: {
                            day: [],
                            month: [],
                            year: []
                        }
                    }
                }
            }
        }
    }

    console.log(`Stats operation: ${Math.round((Date.now() - start) / 1000 * 10) / 10}s`)

    req.servers = servers
    next()
}

async function loadCache(server, data) {
    const now = Date.now()
    const cached = cachedStats.find(i => i.server.toString() == server._id.toString())

    if (cached && cacheEnabled) {
        if (cached.life > now) {
            cache = cached.cache
        } else {
            cachedStats = cachedStats.filter(i => i.server.toString() != server._id.toString())
            var cache = await generateServerCache(server, data)
            cachedStats.push({
                cache,
                life: now + cacheLife,
                server: server._id
            })

            return cache
        }
    } else if (cacheEnabled) {
        var cache = await generateServerCache(server, data)
        cachedStats.push({
            cache,
            life: now + cacheLife,
            server: server._id
        })

        return cache
    }

    return cache
}

async function generateServerCache(server, data) {
    const uptimeInfo = [0, 0]
    const graphs = {
        usage: {
            day: [],
            month: [],
            year: []
        }
    }

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

    for (var i = 0; i < 24; i++) {
        graphs.usage.day.push({ ...defaultTime })
    }

    for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(); i++) {
        graphs.usage.month.push({ ...defaultTime })
    }

    for (var i = 0; i < 12; i++) {
        graphs.usage.year.push({ ...defaultTime })
    }
    var now = new Date()

    const promises = []

    for (var i = server.firstUpdate; i < Date.now(); i += updateInterval * 1000) {
        promises.push(registerPacketStats(i))
    }

    function registerToGraph(packet, graphTime, graphIndex) {
        graphs.usage[graphTime][graphIndex].cpu += packet.cpuUsage
        graphs.usage[graphTime][graphIndex].ram += packet.ramUsage
        graphs.usage[graphTime][graphIndex].storage += packet.storageUsage
        graphs.usage[graphTime][graphIndex].players += packet.players ? packet.players : 0
        graphs.usage[graphTime][graphIndex].messages += packet.messages ? packet.messages : 0
        graphs.usage[graphTime][graphIndex].whispers += packet.whispers ? packet.whispers : 0
        graphs.usage[graphTime][graphIndex].dataCount += 1
        graphs.usage[graphTime][graphIndex].count += 1
    }

    async function registerPacketStats(time) {
        var date = new Date(time)
        const packet = await Data.findOne({ time: { $gt: time - 1, $lt: time + (updateInterval * 1000) + 1 } })

        if (packet) {
            if (date.getUTCFullYear() == now.getUTCFullYear()) {
                registerToGraph(packet, 'year', date.getUTCMonth())

                if (date.getUTCMonth() == now.getUTCMonth()) {
                    registerToGraph(packet, 'month', date.getUTCDate())


                    if (date.getUTCDate() == now.getUTCDate()) {
                        registerToGraph(packet, 'day', date.getHours())

                    }
                }
            }

            uptimeInfo[0]++
        } else {
            if (date.getUTCFullYear() == now.getUTCFullYear()) {
                graphs.usage.year[date.getUTCMonth()].count += 1

                if (date.getUTCMonth() == now.getUTCMonth()) {
                    graphs.usage.month[date.getUTCDate() - 1].count += 1

                    if (date.getUTCDate() == now.getUTCDate()) {
                        graphs.usage.day[date.getUTCHours()].count += 1
                    }
                }
            }
            uptimeInfo[1]++
        }
    }

    await Promise.all(promises)

    const firstDateYear = new Date(server.firstUpdate)
    const firstDateMonth = new Date(server.firstUpdate)

    firstDateYear.setDate(1)
    firstDateYear.setHours(0)
    firstDateMonth.setHours(0)
    var skippedYear = Math.floor((server.firstUpdate - firstDateYear.getTime()) / (updateInterval * 1000))
    var skippedMonth = Math.floor((server.firstUpdate - firstDateMonth.getTime()) / (updateInterval * 1000))

    graphs.usage.year[firstDateYear.getMonth()].count += skippedYear
    graphs.usage.month[firstDateMonth.getDate()].count += skippedMonth

    return {
        storageUsage: Math.round(getDataSize(data) / (server.storage * 1024) * 100),
        storageUsed: Math.ceil(getDataSize(data) / 1024 * 2) / 2,
        uptime: Math.round(uptimeInfo[0] / (uptimeInfo[0] + uptimeInfo[1]) * 100),
        graphs
    }
}

function getDataSize(data) { // KiloBytes
    var total = 0
    var samples = 50
    for (var i = 0; i < samples; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / samples

    return averageSize * data.length / 1024
}

module.exports = middleware