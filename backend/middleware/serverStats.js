const bson = require('bson')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')
const updateInterval = 5

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
                    ramUsage: 0
                },
                cache: {
                    storageUsage: 0,
                    uptime: 0,
                    storageUsed: 0,
                    blocksBroken: 0,
                    blocksPlaced: 0,
                    blocksTraveld: 0,
                    deaths: 0,
                    graphs: getDefaultGraphs(),
                    dataAge: {
                        months3: 0,
                        months6: 0,
                        months12: 0
                    },
                    players: [],
                    playerPeak: 0,
                    totalPlaytime: 0,
                    runningTime: 0,
                    blocksBroken: 0,
                    blocksPlaced: 0,
                    blocksTraveled: 0,
                    itemsCrafted: 0,
                    messages: 0,
                    characters: 0,
                    whispers: 0,
                    commands: 0,
                    deaths: 0,
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

    const graphs = getDefaultGraphs()
    const dataAge = [0, 0, 0, 0] // [3m, 6m, 1y, forever]
    const averagePacket = getAverageDataSize(data)
    var start = data[data.length - 5].time
    // var start = Date.now() - 55492000
    // var startDelay = start % (updateInterval * 1000)
    // console.log(startDelay)

    var now = new Date()
    const month = 30 * 24 * 60 * 60 * 1000

    const promises = []

    const uptimeInfo = [0, 0]
    const players = []
    const blocks = [0, 0, 0] // [broken, placed, traveled]
    var itemsCrafted = 0
    const chat = [0, 0, 0, 0] // [messages, characters, whispers, commands]
    var deaths = 0
    var playerPeak = 0
    var playerpeak = 0
    var totalPlaytime = 0

    function registerToGraph(packet, graphTime, graphIndex) {
        var blocksBroken = 0
        var blocksPlaced = 0
        var blocksTraveled = 0
        var itemsCrafted = 0
        var players = 0

        if (Array.isArray(packet.players))
            for (var player of packet.players) {
                blocksBroken += player.blocksBroken ? parseInt(player.blocksBroken) : 0
                blocksPlaced += player.blocksPlaced ? parseInt(player.blocksPlaced) : 0
                blocksTraveled += player.blocksTraveled ? parseInt(player.blocksTraveled) : 0
                itemsCrafted += player.itemsCrafted ? parseInt(player.itemsCrafted) : 0
                players++
            }

        players = players == 0 ? 1 : players

        graphs[graphTime][graphIndex].cpu += packet.cpuUsage
        graphs[graphTime][graphIndex].ram += packet.ramUsage
        graphs[graphTime][graphIndex].storage += packet.storageUsage
        graphs[graphTime][graphIndex].players += packet.players ? packet.players.length : 0
        graphs[graphTime][graphIndex].messages += packet.messages ? packet.messages : 0
        graphs[graphTime][graphIndex].characters += packet.characters ? packet.characters : 0
        graphs[graphTime][graphIndex].whispers += packet.whispers ? packet.whispers : 0
        graphs[graphTime][graphIndex].commands += packet.commands ? packet.commands : 0
        graphs[graphTime][graphIndex].dataCount += 1

        graphs[graphTime][graphIndex].blocksBrokenPerPlayer += blocksBroken / players
        graphs[graphTime][graphIndex].blocksPlacedPerPlayer += blocksPlaced / players
        graphs[graphTime][graphIndex].blocksTraveledPerPlayer += blocksTraveled / players
        graphs[graphTime][graphIndex].itemsCraftedPerPlayer += itemsCrafted / players

        // graphs[graphTime][graphIndex].cpu += Math.random() * 100
        // graphs[graphTime][graphIndex].ram += Math.random() * 100
        // graphs[graphTime][graphIndex].storage += Math.random() * 10
        // graphs[graphTime][graphIndex].players += Math.random() * 50
        // graphs[graphTime][graphIndex].messages += Math.random() * 1000
        // graphs[graphTime][graphIndex].whispers += Math.random() * 50
        // graphs[graphTime][graphIndex].dataCount += 1

        // graphs[graphTime][graphIndex].count += 1
    }

    function clearGraph(graphTime) {
        for (var graphIndex in graphs[graphTime]) {
            graphs[graphTime][graphIndex].cpu = 0
            graphs[graphTime][graphIndex].ram = 0
            graphs[graphTime][graphIndex].storage = 0
            graphs[graphTime][graphIndex].players = 0
            graphs[graphTime][graphIndex].messages = 0
            graphs[graphTime][graphIndex].characters = 0
            graphs[graphTime][graphIndex].whispers = 0
            graphs[graphTime][graphIndex].commands = 0
            graphs[graphTime][graphIndex].dataCount = 0

            graphs[graphTime][graphIndex].blocksBrokenPerPlayer = 0
            graphs[graphTime][graphIndex].blocksPlacedPerPlayer = 0
            graphs[graphTime][graphIndex].blocksTraveledPerPlayer = 0
            graphs[graphTime][graphIndex].itemsCraftedPerPlayer = 0
        }

    }

    const deletePackets = []

    for (var time = start; time < Date.now(); time += updateInterval * 1000) {
        promises.push(new Promise(async (resolve) => {
            var date = new Date(time)
            const packet = await Data.findOne({ time: { $gt: time - 1, $lt: time + (updateInterval * 1000) + 1 } })


            // if (date.getUTCDate() == now.getUTCDate()) {
            //     registerToGraph(packet, 'day', date.getUTCHours())
            // }

            if (packet) {
                if (server.dataLifetime != 0 && now.getTime() - date.getTime() > server.dataLifetime * month)
                    return deletePackets.push(packet._id)

                if (date.getUTCFullYear() == now.getUTCFullYear()) {
                    registerToGraph(packet, 'year', date.getUTCMonth())

                    if (date.getUTCMonth() == now.getUTCMonth()) {
                        registerToGraph(packet, 'month', date.getUTCDate() - 1)
                        registerToGraph(packet, 'average', date.getUTCHours() - 1)

                        if (date.getUTCDate() == now.getUTCDate()) {
                            registerToGraph(packet, 'day', date.getUTCHours() - 1)
                        }
                    }
                }

                blocks[0] += packet.blocksBroken ? packet.blocksBroken : 0
                blocks[1] += packet.blocksPlaced ? packet.blocksPlaced : 0
                blocks[2] += packet.blocksTraveled ? packet.blocksTraveled : 0
                deaths += packet.deaths ? packet.deaths : 0
                itemsCrafted += packet.itemsCrafted ? packet.itemsCrafted : 0

                if (packet.players.length > playerPeak) {
                    playerpeak = date.getUTCDate()
                    playerPeak = packet.players.length
                    clearGraph('peak')
                }

                if (playerpeak == date.getUTCDate())
                    registerToGraph(packet, 'peak', date.getUTCHours() - 1)

                chat[0] += packet.messages ? packet.messages : 0
                chat[1] += packet.characters ? packet.characters : 0
                chat[2] += packet.whispers ? packet.whispers : 0
                chat[3] += packet.commands ? packet.commands : 0

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
                } else {
                    dataAge[3]++
                }

                uptimeInfo[0]++
            } else {
                uptimeInfo[1]++
            }

            if (date.getUTCFullYear() == now.getUTCFullYear()) {
                graphs.year[date.getUTCMonth()].count += 1

                if (date.getUTCMonth() == now.getUTCMonth()) {
                    graphs.month[date.getUTCDate() - 1].count += 1

                    if (date.getUTCDate() == now.getUTCDate()) {
                        graphs.day[date.getUTCHours()].count += 1
                    }
                }
            }

            resolve()
        }))
    }

    await Promise.all(promises)

    await Promise.all(deletePackets.map(async packet => {
        await Data.deleteOne({ _id: packet })
    }))

    for (var player of players) {
        totalPlaytime += player.playtime
    }

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
        storageUsage: Math.round(averagePacket * data.length / (server.storage * 1024) * 100),
        storageUsed: Math.ceil(averagePacket * data.length / 1024 * 10) / 10,
        uptime: Math.round(uptimeInfo[0] / (uptimeInfo[0] + uptimeInfo[1]) * 100),
        graphs,
        dataAge: {
            months3: Math.round((dataAge[0]) * averagePacket / 1024 * 10) / 10,
            months6: Math.round((dataAge[0] + dataAge[1]) * averagePacket / 1024 * 10) / 10,
            months12: Math.round((dataAge[0] + dataAge[1] + dataAge[2]) * averagePacket / 1024 * 10) / 10,
            forever: Math.round((dataAge[0] + dataAge[1] + dataAge[2] + dataAge[3]) * averagePacket / 1024 * 10) / 10
        },
        players,
        blocksBroken: blocks[0],
        blocksPlaced: blocks[1],
        blocksTraveled: blocks[2],
        itemsCrafted: itemsCrafted,
        messages: chat[0],
        characters: chat[1],
        whispers: chat[2],
        commands: chat[3],
        deaths,
        totalPlaytime,
        playerPeak,
        runningTime: server.lastUpdate - server.firstUpdate
    }

    cachedStats.push({
        cache,
        life: now.getTime() + cacheLife,
        server: server._id
    })

    console.log(`${Math.round((Date.now() - now) / 1000 * 10) / 10}s (${data.length} packets) (searched ${(Math.round((Date.now() - start) / (updateInterval * 1000)))})`)

    return cache
}

function getDefaultGraphs() {
    const defaultTime = {
        cpu: 0,
        ram: 0,
        storage: 0,
        players: 0,
        messages: 0,
        characters: 0,
        whispers: 0,
        commands: 0,
        count: 0,
        dataCount: 0,
        blocksBrokenPerPlayer: 0,
        blocksPlacedPerPlayer: 0,
        blocksTraveledPerPlayer: 0,
        itemsCraftedPerPlayer: 0
    }

    const graphs = { day: [], month: [], year: [], average: [], peak: [] }

    for (var i = 0; i < 24; i++) {
        graphs.day.push({ ...defaultTime })
        graphs.average.push({ ...defaultTime })
        graphs.peak.push({ ...defaultTime })
    }

    for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++)
        graphs.month.push({ ...defaultTime })

    for (var i = 0; i < 12; i++)
        graphs.year.push({ ...defaultTime })

    return graphs
}

function getAverageDataSize(data) { // KiloBytes
    var total = 0
    var samples = 200
    for (var i = 0; i < samples; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / samples

    return averageSize / 1024
}

module.exports = {
    serverStatsMw,
    generateServerCache,
}