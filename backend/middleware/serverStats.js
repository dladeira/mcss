const bson = require('bson')
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
    dataCount: 0
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

            server.data = await Data.find({ server: server._id }).sort({ time: 1 }).lean()
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

    var latestData = server.data.reduce((prev, current) => prev.time > current.time ? prev : current)

    const graphs = new Graphs()
    const timeline = new Timeline(server.firstUpdate)
    const averagePacket = getAverageDataSize(server.data)


    var totalPacketsSkipped = 0
    var playerPeakDate = new Date(server.data[0].time)

    const deletePackets = []

    var lastTime = server.firstUpdate

    // Find out player peak (necessary for peak day calculations)
    for (var packet of server.data) {
        if (packet.players.length > stats.playerPeak) {
            playerPeakDate = new Date(packet.time)
            stats.playerPeak = packet.players.length
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

        totalPacketsSkipped += Math.min(packetsSkipped, 0)

        if (server.dataLifetime != 0 && startTime.getTime() - packetDate.getTime() > server.dataLifetime * MONTH)
            return deletePackets.push(packet._id)

        timeline.registerPacket(packet)

        if (packetDate.getUTCFullYear() == startTime.getUTCFullYear()) {
            graphs.registerPacket(packet, 'year', packetDate.getUTCMonth())

            if (packetDate.getUTCMonth() == startTime.getUTCMonth()) {
                graphs.registerPacket(packet, 'month', packetDate.getUTCDate() - 1)
                graphs.registerPacket(packet, 'average', packetDate.getUTCHours())

                if (packetDate.getUTCDate() == startTime.getUTCDate()) {
                    graphs.registerPacket(packet, 'day', packetDate.getUTCHours())
                }
            }
        }

        if (playerPeakDate.getUTCDate() == packetDate.getUTCDate() && playerPeakDate.getUTCMonth() == packetDate.getUTCMonth() && playerPeakDate.getUTCFullYear() == packetDate.getUTCFullYear())
            graphs.registerPacket(packet, 'peak', packetDate.getUTCHours())

        main:
        for (var packetPlayer of packet.players) {
            const latestPlayer = latestData.players.find(i => i.uuid == packetPlayer.uuid)

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
            if (!packet.players.find(i => i.uuid == statsPlayer.uuid)) {
                if (statsPlayer.session > 0)
                    statsPlayer.sessions.push({ time: packetDate.getTime(), length: statsPlayer.session })
                statsPlayer.session = 0
            }
        }

        // Add packet age
        const timeSince = startTime.getTime() - packetDate.getTime()
        stats.dataAge.forever += averagePacket
        if (timeSince < 12 * MONTH)
            stats.dataAge.months12 += averagePacket
        if (timeSince < 6 * MONTH)
            stats.dataAge.months6 += averagePacket
        if (timeSince < 3 * MONTH)
            stats.dataAge.months3 += averagePacket
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
    stats.storageUsage = Math.round(latestData.storageUsage)
    stats.storageUsed = averagePacket * server.data.length / 1024
    stats.uptime = Math.round(server.data.length / (server.data.length + totalPacketsSkipped) * 100)
    stats.graphs = graphs.getStats()
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

class Graphs {
    constructor() {
        this.day = []
        this.month = []
        this.year = []
        this.average = []
        this.peak = []

        for (var i = 0; i < 24; i++) {
            this.day.push({ ...defaultTime })
            this.average.push({ ...defaultTime })
            this.peak.push({ ...defaultTime })
        }

        for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++)
            this.month.push({ ...defaultTime })

        for (var i = 0; i < 12; i++)
            this.year.push({ ...defaultTime })
    }
    registerPacket(packet, graphType, graphIndex) {
        var blocksBroken = 0
        var blocksPlaced = 0
        var blocksTraveled = 0
        var itemsCrafted = 0
        var playerCount = 0
        var playerStats = [...this[graphType][graphIndex].playerStats]

        for (var player of packet.players) {
            blocksBroken += player.blocksBroken ? parseInt(player.blocksBroken) : 0
            blocksPlaced += player.blocksPlaced ? parseInt(player.blocksPlaced) : 0
            blocksTraveled += player.blocksTraveled ? parseInt(player.blocksTraveled) : 0
            itemsCrafted += player.itemsCrafted ? parseInt(player.itemsCrafted) : 0
            playerCount++

            var found = false
            for (var i of playerStats) {
                if (i.uuid == player.uuid) {
                    i.playtime += 1
                    i.blocksBroken += parseInt(player.blocksBroken)
                    i.blocksPlaced += parseInt(player.blocksPlaced)
                    found = true
                    break
                }
            }

            if (!found) {
                playerStats.push({
                    uuid: player.uuid,
                    playtime: 1,
                    blocksBroken: 0,
                    blocksPlaced: 0
                })
            }
        }

        playerCount = playerCount == 0 ? 1 : playerCount

        this[graphType][graphIndex].cpu += packet.cpuUsage
        this[graphType][graphIndex].ram += packet.ramUsage
        this[graphType][graphIndex].storage += packet.storageUsage
        this[graphType][graphIndex].players += packet.players ? packet.players.length : 0
        this[graphType][graphIndex].messages += packet.messages ? packet.messages : 0
        this[graphType][graphIndex].characters += packet.characters ? packet.characters : 0
        this[graphType][graphIndex].whispers += packet.whispers ? packet.whispers : 0
        this[graphType][graphIndex].commands += packet.commands ? packet.commands : 0
        this[graphType][graphIndex].dataCount += 1

        this[graphType][graphIndex].blocksBrokenPerPlayer += blocksBroken / playerCount
        this[graphType][graphIndex].blocksPlacedPerPlayer += blocksPlaced / playerCount
        this[graphType][graphIndex].blocksTraveledPerPlayer += blocksTraveled / playerCount
        this[graphType][graphIndex].itemsCraftedPerPlayer += itemsCrafted / playerCount

        this[graphType][graphIndex].playerStats = playerStats
    }
    clearGraph(graphType) {
        for (var graphIndex in this[graphType]) {
            this[graphType][graphIndex].cpu = 0
            this[graphType][graphIndex].ram = 0
            this[graphType][graphIndex].storage = 0
            this[graphType][graphIndex].players = 0
            this[graphType][graphIndex].messages = 0
            this[graphType][graphIndex].characters = 0
            this[graphType][graphIndex].whispers = 0
            this[graphType][graphIndex].commands = 0
            this[graphType][graphIndex].dataCount = 0

            this[graphType][graphIndex].blocksBrokenPerPlayer = 0
            this[graphType][graphIndex].blocksPlacedPerPlayer = 0
            this[graphType][graphIndex].blocksTraveledPerPlayer = 0
            this[graphType][graphIndex].itemsCraftedPerPlayer = 0
        }
    }
    getStats() {
        return {
            day: this.day,
            month: this.month,
            year: this.year,
            average: this.average,
            peak: this.peak
        }
    }
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
                stats: {...defaultTime}
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
                    i.playtime += 1
                    i.blocksBroken += parseInt(player.blocksBroken)
                    i.blocksPlaced += parseInt(player.blocksPlaced)
                    found = true
                    break
                }
            }

            if (!found) {
                playerStats.push({
                    uuid: player.uuid,
                    playtime: 1,
                    blocksBroken: 0,
                    blocksPlaced: 0
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

function getAverageDataSize(data) { // KiloBytes
    var total = 0
    var samples = 200
    for (var i = 0; i < samples; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / samples

    return averageSize / 1024
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
            max_players: 20,
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
                    session: 1078,
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
                    session: Math.round(Math.random * 1000),
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
                    session: 644,
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
                    session: Math.round(Math.random * 1000),
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
                    session: Math.round(Math.random * 1000),
                    online: false
                }
            ],
            graphs: generateFakeGraphs()
        }
    }
}

function generateFakeGraphs() {
    const graphs = new Graphs()

    function generateFakePacket() {
        const packet = {}

        packet.players = [
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
        ]

        packet.cpuUsage = Math.round(Math.random() * 50 + 20)
        packet.ramUsage = Math.round(Math.random() * 20 + 60)
        packet.storageUsage = Math.round(Math.random() * 20)

        return packet
    }

    for (var i = 0; i < 24; i++) {
        graphs.registerPacket(generateFakePacket(), 'day', i)
        graphs.registerPacket(generateFakePacket(), 'average', i)
        graphs.registerPacket(generateFakePacket(), 'peak', i)
    }

    for (var i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
        graphs.registerPacket(generateFakePacket(), 'month', i)
    }

    for (var i = 0; i < 12; i++) {
        graphs.registerPacket(generateFakePacket(), 'year', i)
    }

    return graphs.getStats()
}

module.exports = {
    serverStatsMw,
    removeCache
}