const bson = require('bson')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')
const config = require('config');

const cacheEnabled = false
const cacheLife = config.get('serverStats.cacheLife') * 1000

var cachedStats = []

async function serverStatsMw(req, res, next) {
    if (req.demo) {
        const servers = []

        servers.push(generateFakeServer("SpaghettiMC", "KHqSLuyliCO2KUtQ"))
        servers.push(generateFakeServer("MineDiamonds", "NUUcAI5eaH56DRZL"))

        req.servers = servers

        return next()
    }

    const servers = await Server.find({ owner: req.user._id }).populate('datas').lean()

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
    // if (cached && cacheEnabled) {
    //     if (cached.life > Date.now()) {
    //         return cached.cache
    //     } else {
    //         return await generateServerCache(server, data)
    //     }
    // }

    return await generateServerCache(server, data)
}

async function generateServerCache(server, data) {

    const user = await User.findOne({ _id: server.owner })
    const updateInterval = user.plan.updateFrequency * 1000

    var latestData = data.reduce((prev, current) => prev.time > current.time ? prev : current)

    process.stdout.write('Cache GEN operation: ')

    cachedStats = cachedStats.filter(i => i.server.toString() != server._id.toString())

    const graphs = getDefaultGraphs()
    const dataAge = [0, 0, 0, 0] // [3m, 6m, 1y, forever]
    const averagePacket = getAverageDataSize(data)

    var now = new Date()
    const month = 30 * 24 * 60 * 60 * 1000

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


    uptimeInfo[1]++
    var lastTime = server.firstUpdate
    var i = 0

    for (var packet of server.datas) {
        var date = new Date(packet.time)

        var lastPacketDelay = lastTime % updateInterval
        var lastPacketExpected = lastTime - lastPacketDelay
        var packetDelay = packet.time % updateInterval
        var packetExpected = packet.time - packetDelay
        var timeSkipped = packetExpected - lastPacketExpected - updateInterval
        var packetsSkipped = timeSkipped / updateInterval

        lastTime = packet.time

        uptimeInfo[0] += 1
        uptimeInfo[1] += packetsSkipped

        if (server.dataLifetime != 0 && now.getTime() - date.getTime() > server.dataLifetime * month)
            return deletePackets.push(packet._id)

        if (date.getUTCFullYear() == now.getUTCFullYear()) {
            registerToGraph(packet, 'year', date.getUTCMonth())

            if (date.getUTCMonth() == now.getUTCMonth()) {
                registerToGraph(packet, 'month', date.getUTCDate() - 1)
                registerToGraph(packet, 'average', date.getUTCHours())

                if (date.getUTCDate() == now.getUTCDate()) {
                    registerToGraph(packet, 'day', date.getUTCHours())
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

        chat[0] += packet.messages
        chat[1] += packet.characters
        chat[2] += packet.whispers
        chat[3] += packet.commands

        main:
        for (var stats of packet.players) {
            for (var player of players) {
                if (stats.uuid == player.uuid) {
                    if (packetsSkipped) {
                        player.session = 0
                    } else {
                        player.session += user.plan.updateFrequency
                    }

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
                location: latestPlayer ? `(${latestPlayer['location.x']}, ${latestPlayer['location.y']}, ${latestPlayer['location.z']})` : null,
                online: latestPlayer ? true : false,
                session: latestPlayer ? user.plan.updateFrequency : null
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
    }

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

    console.log(`${Math.round((Date.now() - now) / 1000 * 10) / 10}s (${data.length} packets) (searched ${(Math.round((Date.now() - server.firstUpdate) / (updateInterval * 1000)))})`)

    return cache
}

function generateFakeServer(name, id) {
    return {
        _id: id,
        name: name,
        type: "regular",
        storage: 5,
        owner: null,
        dataLifetime: 0,
        recentMessages: [
            { msg: "Work it, make it, do it", sender: "DaddyBlockbone" },
            { msg: "Makes us harder, better, faster, stronger", sender: "DespacitoMaster" },
            { msg: "N-n-now that that don't kill me", sender: "DespacitoMaster" },
            { msg: "Can only make me stronger", sender: "DespacitoMaster" },
            { msg: "I need you to hurry up now, 'Cause I can't wait much longer", sender: "DespacitoMaster" },
            { msg: "I know I got to be right now", sender: "DespacitoMaster" },
            { msg: "'Cause I can't get much wronger", sender: "DespacitoMaster" },
            { msg: "Man, I've been waiting all night now", sender: "DespacitoMaster" },
            { msg: "That's how long I've been on ya", sender: "DespacitoMaster" },
            { msg: "(Work it harder, make it better)", sender: "Maximimand" },
            { msg: "(Do it faster, makes us stronger)", sender: "Maximimand" },
        ],
        stats: {
            live: { cpuUsage: Math.round(Math.random() * 100), ramUsage: Math.round(Math.random() * 100) },
            cache: {
                storageUsed: 2.6,
                storageUsage: Math.round(Math.random() * 100),
                uptime: 97,
                blocksBroken: Math.round(Math.random() * 1000000),
                blocksPlaced: Math.round(Math.random() * 1000000),
                blocksTraveled: Math.round(Math.random() * 10000000),
                deaths: Math.round(Math.random() * 300),
                dataAge: {
                    months3: 0.5,
                    months6: 1.1,
                    months12: 1.7,
                    forever: 2.6
                },
                messages: Math.round(Math.random() * 100000),
                characters: Math.round(Math.random() * 10000),
                whispers: Math.round(Math.random() * 1000),
                commands: Math.round(Math.random() * 1000),
                runningTime: 864000000,
                playerPeak: 4,
                totalPlaytime: Math.round(Math.random() * 100000) + 300000,
                players: [
                    {
                        playtime: Math.random() * 50000 + 100000,
                        blocksBroken: Math.round(Math.random() * 10000),
                        blocksPlaced: Math.round(Math.random() * 10000),
                        blocksTraveled: Math.round(Math.random() * 10000),
                        deaths: Math.round(Math.random() * 10),
                        itemsCrafted: Math.round(Math.random() * 1000),
                        messages: Math.round(Math.random() * 1000),
                        characters: Math.round(Math.random() * 10000),
                        whispers: Math.round(Math.random() * 100),
                        commands: Math.round(Math.random() * 100),
                        location: `(${Math.round(Math.random() * 1000)}, ${Math.round(Math.random() * 100)}, ${Math.round(Math.random() * 1000)})`,
                        username: 'DespacitoMaster',
                        online: true,
                    },
                    {
                        playtime: Math.random() * 50000 + 100000,
                        blocksBroken: Math.round(Math.random() * 10000),
                        blocksPlaced: Math.round(Math.random() * 10000),
                        blocksTraveled: Math.round(Math.random() * 10000),
                        deaths: Math.round(Math.random() * 40),
                        itemsCrafted: Math.round(Math.random() * 1000),
                        messages: Math.round(Math.random() * 1000),
                        characters: Math.round(Math.random() * 10000),
                        whispers: Math.round(Math.random() * 100),
                        commands: Math.round(Math.random() * 100),
                        location: `---`,
                        username: 'Maximimand',
                        online: false,
                    },
                    {
                        playtime: Math.random() * 50000 + 100000,
                        blocksBroken: Math.round(Math.random() * 10000),
                        blocksPlaced: Math.round(Math.random() * 10000),
                        blocksTraveled: Math.round(Math.random() * 10000),
                        deaths: Math.round(Math.random() * 40),
                        itemsCrafted: Math.round(Math.random() * 1000),
                        messages: Math.round(Math.random() * 1000),
                        characters: Math.round(Math.random() * 10000),
                        whispers: Math.round(Math.random() * 100),
                        commands: Math.round(Math.random() * 100),
                        location: `(${Math.round(Math.random() * 1000)}, ${Math.round(Math.random() * 100)}, ${Math.round(Math.random() * 1000)})`,
                        username: 'Xx_420No0B420_xX',
                        online: true,
                    },
                    {
                        playtime: Math.random() * 50000 + 100000,
                        blocksBroken: Math.round(Math.random() * 10000),
                        blocksPlaced: Math.round(Math.random() * 10000),
                        blocksTraveled: Math.round(Math.random() * 10000),
                        deaths: Math.round(Math.random() * 40),
                        itemsCrafted: Math.round(Math.random() * 1000),
                        messages: Math.round(Math.random() * 1000),
                        characters: Math.round(Math.random() * 10000),
                        whispers: Math.round(Math.random() * 100),
                        commands: Math.round(Math.random() * 100),
                        location: `---`,
                        username: 'DaddyBlockbone',
                        online: false
                    },
                    {
                        playtime: Math.random() * 50000 + 100000,
                        blocksBroken: Math.round(Math.random() * 10000),
                        blocksPlaced: Math.round(Math.random() * 10000),
                        blocksTraveled: Math.round(Math.random() * 10000),
                        deaths: Math.round(Math.random() * 40),
                        itemsCrafted: Math.round(Math.random() * 1000),
                        messages: Math.round(Math.random() * 1000),
                        characters: Math.round(Math.random() * 10000),
                        whispers: Math.round(Math.random() * 100),
                        commands: Math.round(Math.random() * 100),
                        location: `---`,
                        username: 'Wolfie2024',
                        online: false
                    }
                ],
                graphs: generateFakeGraphs()
            }
        }
    }
}

function generateFakeGraphs() {
    const graphs = getDefaultGraphs()

    function registerToGraph(graphTime, graphIndex) {
        graphs[graphTime][graphIndex].cpu += Math.round(Math.random() * 50 + 20)
        graphs[graphTime][graphIndex].ram += Math.round(Math.random() * 20 + 60)
        graphs[graphTime][graphIndex].storage += Math.round(Math.random() * 20)
        graphs[graphTime][graphIndex].players += Math.round(Math.random() * 5)
        graphs[graphTime][graphIndex].messages += Math.round(Math.random() * 300)
        graphs[graphTime][graphIndex].characters += Math.round(Math.random() * 1000)
        graphs[graphTime][graphIndex].whispers += Math.round(Math.random() * 30)
        graphs[graphTime][graphIndex].commands += Math.round(Math.random() * 40)

        graphs[graphTime][graphIndex].blocksBrokenPerPlayer += Math.random() * 1000
        graphs[graphTime][graphIndex].blocksPlacedPerPlayer += Math.random() * 1000
        graphs[graphTime][graphIndex].blocksTraveledPerPlayer += Math.random() * 1000
        graphs[graphTime][graphIndex].itemsCraftedPerPlayer += Math.random() * 100

        graphs[graphTime][graphIndex].dataCount += 1
        graphs[graphTime][graphIndex].count += 1
    }

    for (var i = 0; i < 24; i++) {
        registerToGraph('day', i)
        registerToGraph('average', i)
        registerToGraph('peak', i)
    }

    for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
        registerToGraph('month', i)
    }

    for (var i = 0; i < 12; i++) {
        registerToGraph('year', i)
    }

    return graphs
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