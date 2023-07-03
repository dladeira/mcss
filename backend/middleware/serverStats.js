const config = require('config')

const User = require('../models/User')
const Server = require('../models/Server')
const Data = require('../models/Data')

const MONTH = 30 * 24 * 60 * 60 * 1000

const cache = []

const DEFAULT_STATS = {
    cpuUsage: 0,
    ramUsage: 0,
    storageUsage: 0,
    storageUsed: 0,
    uptime: 0,
    graphs: 0,
    dataAge: {
        months3: 0,
        months6: 0,
        months12: 0,
        forever: 0
    },
    players: [],
    max_players: 0,
    blocksBroken: 0,
    blocksPlaced: 0,
    blocksTraveled: 0,
    itemsCrafted: 0,
    messages: 0,
    characters: 0,
    whispers: 0,
    commands: 0,
    deaths: 0,
    totalPlaytime: 0,
    playerPeak: 0,
    runningTime: 0,
    dataCount: 0,
    peakTime: Date.now()
}

async function serverStatsMw(req, res, next) {
    if (req.demo)
        return handleDemo(req, res, next)

    var servers, globalCount, serverCount, expectedCount, cachedCount

    await executeOperation('FIND', async () => {
        servers = await Server.find({ owner: req.user._id }).lean()
        globalCount = await Data.countDocuments({}).lean()

        for (var server of servers) {
            const cached = findCache(server)

            if (cached) {
                server.stats = cached
                continue
            }

            server.data = await Data.find({ server: server._id }).sort({ time: 1 }).allowDiskUse(true).lean()
        }

        serverCount = servers.reduce((a, obj) => a + (obj.data ? obj.data.length : obj.stats.dataCount), 0)
        cachedCount = servers.reduce((a, obj) => a + (obj.data ? 0 : obj.stats.dataCount), 0)
        expectedCount = servers.reduce((a, obj) => a + ((Date.now() - obj.firstUpdate) / 1000 / req.user.plan.updateFrequency), 0)
    })

    await executeOperation('GEN', async () => {
        for (var server of servers) {
            if (server.stats) // Stats are already cached
                continue
            server.stats = await generateStats(server)
            delete server.data
        }
    })

    console.log(`(${formatNumber(serverCount)} packets) (${formatNumber(cachedCount)} cached) (${formatNumber(expectedCount)} total) (${formatNumber(globalCount)} global)`)

    req.servers = servers
    next()
}

function cacheStats(server, stats, lifespan) {
    if (config.get("cache.enabled")) {
        removeCache(server)

        cache.push({
            _id: server._id,
            stats: stats,
            expire: Date.now() + lifespan
        })
    }
}

function findCache(server) {
    if (config.get("cache.enabled")) {
        const cachedStats = cache.find(i => toString(i._id) == toString(server._id) && Date.now() < i.expire)
        return cachedStats ? cachedStats.stats : undefined
    }
}

function removeCache(server) {
    const index = cache.findIndex(i => toString(i._id) == toString(server._id))

    if (index > -1) {
        cache.splice(index, 1)
    }
}

async function generateStats(server) {
    const startTime = new Date()

    const user = await User.findOne({ _id: server.owner })
    const updateInterval = user.plan.updateFrequency * 1000

    var stats = JSON.parse(JSON.stringify(DEFAULT_STATS))

    var latestData = server.data[server.data.length - 1]
    const timeline = new Timeline(server.firstUpdate)

    var totalPacketsSkipped = 0
    var playerPeakDate = new Date(server.data[0].time)

    const deletePackets = []

    var lastTime = server.firstUpdate

    // Find out player peak (necessary for peak day calculations)
    for (var packet of server.data) {
        if (packet.players.length > stats.playerPeak) {
            playerPeakDate = new Date(packet.time)
            stats.playerPeak = packet.players.length
            stats.peakTime = playerPeakDate.getTime()
        }
    }

    for (var packet of server.data) {
        var packetDate = new Date(packet.time)

        var lastPacketDelay = lastTime % updateInterval
        var lastPacketExpected = lastTime - lastPacketDelay
        var packetDelay = packet.time % updateInterval
        var packetExpected = packet.time - packetDelay
        var timeSkipped = packetExpected - lastPacketExpected - updateInterval
        var packetsSkipped = timeSkipped / updateInterval

        lastTime = packet.time

        totalPacketsSkipped += Math.max(packetsSkipped, 0)

        if (server.dataLifetime != 0 && startTime.getTime() - packetDate.getTime() > server.dataLifetime * MONTH) {
            deletePackets.push(packet._id)
            continue
        }

        timeline.registerPacket(packet)

        main:
        for (var packetPlayer of packet.players) {
            const latestPlayer = packetsSkipped == 0 ? latestData.players.find(i => i.uuid == packetPlayer.uuid) : null

            // Existing player
            for (var statsPlayer of stats.players) {
                if (packetPlayer.uuid == statsPlayer.uuid) {
                    statsPlayer.username = packetPlayer.username
                    statsPlayer.blocksBroken += parseInt(packetPlayer.blocksBroken)
                    statsPlayer.blocksPlaced += parseInt(packetPlayer.blocksPlaced)
                    statsPlayer.blocksTraveled += parseInt(packetPlayer.blocksTraveled)
                    statsPlayer.deaths += parseInt(packetPlayer.deaths)
                    statsPlayer.itemsCrafted += parseInt(packetPlayer.itemsCrafted)
                    statsPlayer.messages += parseInt(packetPlayer.messages)
                    statsPlayer.characters += parseInt(packetPlayer.characters)
                    statsPlayer.whispers += parseInt(packetPlayer.whispers)
                    statsPlayer.commands += parseInt(packetPlayer.commands)


                    statsPlayer.playtime += user.plan.updateFrequency
                    statsPlayer.session += user.plan.updateFrequency
                    statsPlayer.lastOnline = packetDate.getTime()
                    continue main
                }
            }

            // New player
            stats.players.push({
                uuid: packetPlayer.uuid,
                username: packetPlayer.username,
                playtime: user.plan.updateFrequency,
                messages: parseInt(packetPlayer.messages),
                blocksBroken: parseInt(packetPlayer.blocksBroken),
                blocksPlaced: parseInt(packetPlayer.blocksPlaced),
                blocksTraveled: parseInt(packetPlayer.blocksTraveled),
                deaths: parseInt(packetPlayer.deaths),
                itemsCrafted: parseInt(packetPlayer.itemsCrafted),
                messages: parseInt(packetPlayer.messages),
                characters: parseInt(packetPlayer.characters),
                whispers: parseInt(packetPlayer.whispers),
                commands: parseInt(packetPlayer.commands),

                joined: packetDate.getTime(),
                lastOnline: packetDate.getTime(),

                location: latestPlayer ? `(${latestPlayer['location.x']}, ${latestPlayer['location.y']}, ${latestPlayer['location.z']})` : null,
                online: latestPlayer ? true : false,
                session: latestPlayer ? user.plan.updateFrequency : null,
                sessions: []
            })
        }

        // Reset session for offline players
        for (var statsPlayer of stats.players) {
            if (!packet.players.find(i => i.uuid == statsPlayer.uuid) || packetsSkipped > 0) {
                if (statsPlayer.session > 0)
                    statsPlayer.sessions.push({ time: packetDate.getTime(), length: statsPlayer.session })
                statsPlayer.session = 0
            }
        }

        // Add packet age
        const timeSince = startTime.getTime() - packetDate.getTime()
        stats.dataAge.forever += 1000
        if (timeSince < 12 * MONTH)
            stats.dataAge.months12 += 1000
        if (timeSince < 6 * MONTH)
            stats.dataAge.months6 += 1000
        if (timeSince < 3 * MONTH)
            stats.dataAge.months3 += 1000
    }

    // Add individual player stats to global stats
    for (var statsPlayer of stats.players) {
        stats.totalPlaytime += statsPlayer.playtime
        stats.blocksBroken += statsPlayer.blocksBroken
        stats.blocksPlaced += statsPlayer.blocksPlaced
        stats.blocksTraveled += statsPlayer.blocksTraveled
        stats.deaths += statsPlayer.deaths
        stats.itemsCrafted += statsPlayer.itemsCrafted
        stats.messages += statsPlayer.messages
        stats.characters += statsPlayer.characters
        stats.whispers += statsPlayer.whispers
        stats.commands += statsPlayer.commands
    }

    // Set final stats
    stats.cpuUsage = latestData.cpuUsage
    stats.ramUsage = latestData.ramUsage
    stats.storageUsage = Math.floor(server.data.length / 1024 / server.storage * 100)
    stats.storageUsed = server.data.length / 1024
    stats.uptime = Math.round(server.data.length / (server.data.length + totalPacketsSkipped) * 100)
    stats.timeline = timeline.getStats()
    stats.dataAge = {
        months3: Math.round(stats.months3 / 1024 * 10) / 10,
        months6: Math.round(stats.months6 / 1024 * 10) / 10,
        months12: Math.round(stats.months12 / 1024 * 10) / 10,
        forever: Math.round(stats.forever / 1024 * 10) / 10
    }
    stats.max_players = latestData.max_players
    stats.runningTime = server.lastUpdate - server.firstUpdate
    stats.dataCount = server.data.length

    cacheStats(server, stats, user.plan.updateFrequency * 1000)

    return stats
}

// ==========
// HELPERS
// ==========

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
    itemsCraftedPerPlayer: 0,
    playerStats: []
}

class Timeline {
    constructor(start) {
        this.start = start - (start % 3600000)
        this.data = []

        for (var i = this.start; i < Date.now() + (Date.now() % 3600 * 1000); i += 3600 * 1000) {
            const date = new Date(i)
            this.data.push({
                hour: date.getUTCHours(),
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                time: i,
                stats: { ...defaultTime }
            })
        }
    }
    findTimestamp(time) {
        const date = new Date(time)

        return this.data.find(timestamp => (date.getUTCHours() == timestamp.hour) && (date.getUTCDate() == timestamp.day) && (date.getUTCMonth() == timestamp.month) && (date.getUTCFullYear() == timestamp.year))

        // 10MS faster but not sure if data is accurate
        // return this.data[((time - this.start) - ((time - this.start) % 3600000)) / 3600000]
    }
    registerPacket(packet) {
        const timeStamp = this.findTimestamp(packet.time)
        timeStamp.stats = timeStamp.stats

        var blocksBroken = 0
        var blocksPlaced = 0
        var blocksTraveled = 0
        var itemsCrafted = 0
        var playerCount = 0
        var playerStats = [...timeStamp.stats.playerStats]

        for (var player of packet.players) {
            blocksBroken += player.blocksBroken ? parseInt(player.blocksBroken) : 0
            blocksPlaced += player.blocksPlaced ? parseInt(player.blocksPlaced) : 0
            blocksTraveled += player.blocksTraveled ? parseInt(player.blocksTraveled) : 0
            itemsCrafted += player.itemsCrafted ? parseInt(player.itemsCrafted) : 0
            playerCount++

            var found = false
            for (var i of playerStats) {
                if (i.uuid == player.uuid) {
                    i.playtime += parseInt(player.playtime)
                    i.blocksBroken += parseInt(player.blocksBroken)
                    i.blocksPlaced += parseInt(player.blocksPlaced)
                    found = true
                    break
                }
            }

            if (!found) {
                playerStats.push({
                    uuid: player.uuid,
                    playtime: parseInt(player.playtime),
                    blocksBroken: parseInt(player.blocksBroken),
                    blocksPlaced: parseInt(player.blocksPlaced)
                })
            }
        }

        playerCount = playerCount == 0 ? 1 : playerCount

        timeStamp.stats.cpu += packet.cpuUsage
        timeStamp.stats.ram += packet.ramUsage
        timeStamp.stats.storage += packet.storageUsage
        timeStamp.stats.players += packet.players ? packet.players.length : 0
        timeStamp.stats.messages += packet.messages ? packet.messages : 0
        timeStamp.stats.characters += packet.characters ? packet.characters : 0
        timeStamp.stats.whispers += packet.whispers ? packet.whispers : 0
        timeStamp.stats.commands += packet.commands ? packet.commands : 0
        timeStamp.stats.dataCount += 1

        timeStamp.stats.blocksBrokenPerPlayer += blocksBroken / playerCount
        timeStamp.stats.blocksPlacedPerPlayer += blocksPlaced / playerCount
        timeStamp.stats.blocksTraveledPerPlayer += blocksTraveled / playerCount
        timeStamp.stats.itemsCraftedPerPlayer += itemsCrafted / playerCount

        timeStamp.stats.playerStats = playerStats
    }
    getStats() {
        return this.data
    }
}

async function executeOperation(opName, op) {
    const start = Date.now()
    process.stdout.write(`${opName} operation: `)

    await op()

    var duration = Date.now() - start
    process.stdout.write(`${formatTime(duration / 1000)}\n`)
}

function formatNumber(number) {
    var lead = 0
    var unit = ""

    if (number >= 1000000) {
        lead = number / 1000000
        unit = "m"
    } else if (number >= 1000) {
        lead = number / 1000
        unit = "k"
    } else {
        lead = number
        unit = ""
    }

    return (lead > 0 ? lead.toPrecision(3) : lead) + unit
}

function formatTime(seconds) {
    var lead = 0
    var unit = ""
    if (seconds >= 86400) {
        lead = seconds / 86400
        unit = "d"
    } else if (seconds >= 3600) {
        lead = seconds / 3600
        unit = "h"
    } else if (seconds >= 60) {
        lead = seconds / 60
        unit = "m"
    } else {
        lead = seconds
        unit = "s"
    }

    return lead.toPrecision(2) + unit
}

// ==========
// DEMO
// ==========

function handleDemo(req, res, next) {
    const servers = []

    servers.push(generateFakeServer("SpaghettiMC", "KHqSLuyliCO2KUtQ"))
    servers.push(generateFakeServer("MineDiamonds", "NUUcAI5eaH56DRZL"))

    req.servers = servers

    return next()
}

function generateFakeServer(name, id) {
    return {
        _id: id,
        name: name,
        type: "regular",
        storage: 5,
        owner: null,
        dataLifetime: 0,
        stats: {
            cpuUsage: Math.round(Math.random() * 100),
            ramUsage: Math.round(Math.random() * 100),
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
            peakInfo: {
                day: new Date(Date.now() - (68 * 60 * 60 * 1000)).getUTCDate(),
                year: new Date(Date.now() - (68 * 60 * 60 * 1000)).getUTCFullYear(),
                month: new Date(Date.now() - (68 * 60 * 60 * 1000)).getUTCMonth()
            },
            max_players: 20,
            totalPlaytime: Math.round(Math.random() * 100000) + 300000,
            players: [
                generateFakePlayer('DespacitoMaster', Math.random() > 0.5, false, false),
                generateFakePlayer('DaddyBlockbone', Math.random() > 0.5, false, false),
                generateFakePlayer('Xx_420No0b420_xX', Math.random() > 0.5, false, false),
                generateFakePlayer('Wolfie2024', Math.random() > 0.5, true, false),
                generateFakePlayer('Maximimand4', Math.random() > 0.5, true, false)
            ],
            timeline: generateFakeTimeline()
        }
    }
}

function generateFakeTimeline() {
    const timeline = new Timeline(Date.now() - (2920 * 60 * 60 * 1000))

    for (var i = 0; i < 2920; i++) {
        timeline.registerPacket(generateFakePacket((Date.now()) - (i * 60 * 60 * 1000)))
    }

    return timeline.getStats()
}

function generateFakePacket(time) {
    const packet = {}

    packet.players = [
        generateFakePlayer('DespacitoMaster', Math.random() > 0.5, false, true),
        generateFakePlayer('DaddyBlockbone', Math.random() > 0.5, false, true),
        generateFakePlayer('Xx_420No0b420_xX', false, false, true),
        generateFakePlayer('Wolfie2024', Math.random() > 0.5, true, true),
        generateFakePlayer('Maximimand4', Math.random() > 0.5, true, true),
    ]

    packet.cpuUsage = Math.round(Math.random() * 50 + 20)
    packet.ramUsage = Math.round(Math.random() * 20 + 60)
    packet.storageUsage = Math.round(Math.random() * 20)
    packet.time = time

    return packet
}

function generateFakePlayer(username, online, recent, packetPlayer) {
    if (packetPlayer) {
        if (Math.random() > 0.9)
            return {
                blocksBroken: Math.random() * 50,
                blocksPlaced: Math.random() * 10,
                itemsCrafted: Math.random() * 2,
                blocksTraveled: Math.random() * 100,
                username: username,
                playtime: Math.random() * 30,
                uuid: username
            }
        else
            return {
                blocksBroken: 0,
                blocksPlaced: 0,
                itemsCrafted: 0,
                blocksTraveled: 0,
                username: username,
                uuid: username
            }
    }

    const player = {
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
        location: online ? `(${Math.round(Math.random() * 3000 - 1500)}, ${Math.round(Math.random() * 3000 - 1500)}, ${Math.round(Math.random() * 3000 - 1500)})` : `---`,
        sessions: [],
        username: username,
        uuid: username,
        online: online,
        joined: recent ? Date.now() - 3600000 : Date.now() - (48 * 60 * 60 * 1000),
        lastOnline: online ? Date.now() : Date.now() - Math.round(Math.random() * 48 * 60 * 60 * 1000),
        session: online ? Math.random() * 4 * 60 * 60 : 0
    }

    for (var i = 0; i < 20; i++)
        player.sessions.push({ time: Date.now() - Math.random() * 20160 * 60 * 1000, length: Math.random() * 10000 })

    return player
}

module.exports = {
    serverStatsMw,
    removeCache
}