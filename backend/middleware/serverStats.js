const bson = require('bson')

const User = require('../models/User')
const Server = require('../models/Server')

const MONTH = 30 * 24 * 60 * 60 * 1000

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
    runningTime: 0
}

async function serverStatsMw(req, res, next) {
    if (req.demo) {
        const servers = []

        servers.push(generateFakeServer("SpaghettiMC", "KHqSLuyliCO2KUtQ"))
        servers.push(generateFakeServer("MineDiamonds", "NUUcAI5eaH56DRZL"))

        req.servers = servers

        return next()
    }

    process.stdout.write('FIND operation: ')
    const startTime = Date.now()
    // const servers = await Server.find({ owner: req.user._id })
    const servers = await Server.aggregate().lookup({
        from: 'datas', let: {
            server: "$_id"
        }, pipeline: [
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$server", "$$server"] }
                        ]
                    }
                }
            },
            {
                $sort: { time: 1 }
            }
        ],
        as: 'data'
    })

    console.log(`${Math.round((Date.now() - startTime) / 1000 * 100) / 100}s (${servers.reduce((a, obj) => a + obj.data.length, 0)} packets)`)

    for (var server of servers) {
        server.stats = await generateStats(server)
        delete server.data
    }

    req.servers = servers
    next()
}

async function generateStats(server) {
    process.stdout.write('GEN operation: ')
    const startTime = new Date()

    const user = await User.findOne({ _id: server.owner })
    const updateInterval = user.plan.updateFrequency * 1000

    var stats = JSON.parse(JSON.stringify(DEFAULT_STATS))

    var latestData = server.data.reduce((prev, current) => prev.time > current.time ? prev : current)

    const graphs = new Graphs()
    const averagePacket = getAverageDataSize(server.data)


    var totalPacketsSkipped = 0
    var playerPeakTime = 0

    const deletePackets = []


    var lastTime = server.firstUpdate

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


        if (packet.players.length > stats.playerPeak) {
            playerPeakTime = packetDate
            stats.playerPeak = packet.players.length
            graphs.clearGraph('peak')
        }

        if (playerPeakTime && playerPeakTime.getUTCDate() == packetDate.getUTCDate() && playerPeakTime.getUTCMonth() == packetDate.getUTCMonth() && playerPeakTime.getUTCFullYear() == packetDate.getUTCFullYear())
            graphs.registerPacket(packet, 'peak', packetDate.getUTCHours())

        main:
        for (var packetPlayer of packet.players) {
            const latestPlayer = latestData.players.find(i => i.uuid == packetPlayer.uuid)

            // Existing player
            for (var statsPlayer of stats.players) {
                if (packetPlayer.uuid == statsPlayer.uuid) {
                    statsPlayer.username = packetPlayer.username
                    statsPlayer.messages += parseInt(packetPlayer.messages)
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

                location: latestPlayer ? `(${latestPlayer['location.x']}, ${latestPlayer['location.y']}, ${latestPlayer['location.z']})` : null,
                online: latestPlayer ? true : false,
                session: latestPlayer ? user.plan.updateFrequency : null
            })
        }

        // Reset session for offline players
        for (var statsPlayer of stats.players) {
            if (!packet.players.find(i => i.uuid == statsPlayer.uuid)) {
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
    stats.storageUsed = latestData.storageUsed
    stats.uptime = Math.round(server.data.length / (server.data.length + totalPacketsSkipped) * 100)
    stats.graphs = graphs.getStats()
    stats.dataAge = {
        months3: Math.round(stats.months3 / 1024 * 10) / 10,
        months6: Math.round(stats.months6 / 1024 * 10) / 10,
        months12: Math.round(stats.months12 / 1024 * 10) / 10,
        forever: Math.round(stats.forever / 1024 * 10) / 10
    }
    stats.max_players = latestData.max_players
    stats.runningTime = server.lastUpdate - server.firstUpdate

    console.log(`${Math.round((Date.now() - startTime) / 1000 * 100) / 100}s (${server.data.length} packets) (${Math.round((Date.now() - server.firstUpdate) / updateInterval)} total)`)

    return stats
}

class Graphs {
    constructor() {
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
        var players = 0

        for (var player of packet.players) {
            blocksBroken += player.blocksBroken ? parseInt(player.blocksBroken) : 0
            blocksPlaced += player.blocksPlaced ? parseInt(player.blocksPlaced) : 0
            blocksTraveled += player.blocksTraveled ? parseInt(player.blocksTraveled) : 0
            itemsCrafted += player.itemsCrafted ? parseInt(player.itemsCrafted) : 0
            players++
        }

        players = players == 0 ? 1 : players

        this[graphType][graphIndex].cpu += packet.cpuUsage
        this[graphType][graphIndex].ram += packet.ramUsage
        this[graphType][graphIndex].storage += packet.storageUsage
        this[graphType][graphIndex].players += packet.players ? packet.players.length : 0
        this[graphType][graphIndex].messages += packet.messages ? packet.messages : 0
        this[graphType][graphIndex].characters += packet.characters ? packet.characters : 0
        this[graphType][graphIndex].whispers += packet.whispers ? packet.whispers : 0
        this[graphType][graphIndex].commands += packet.commands ? packet.commands : 0
        this[graphType][graphIndex].dataCount += 1

        this[graphType][graphIndex].blocksBrokenPerPlayer += blocksBroken / players
        this[graphType][graphIndex].blocksPlacedPerPlayer += blocksPlaced / players
        this[graphType][graphIndex].blocksTraveledPerPlayer += blocksTraveled / players
        this[graphType][graphIndex].itemsCraftedPerPlayer += itemsCrafted / players
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
    const graphs = getDefaultGraph()

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
function getAverageDataSize(data) { // KiloBytes
    var total = 0
    var samples = 200
    for (var i = 0; i < samples; i++)
        total += bson.serialize(data[Math.floor(Math.random() * data.length)]).length

    var averageSize = total / samples

    return averageSize / 1024
}

module.exports = {
    serverStatsMw
}