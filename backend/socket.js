const argv = require('minimist')(process.argv.slice(2))
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

const User = require('./models/User')

const sockets = []


function setup(server) {
    io = new Server(server, {
        cors: {
            origin: argv['origin'],
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        // console.log("Socket Connected")

        socket.on('register', (token) => {
            let foundSocket = sockets.find(i => i.token == token)

            if (foundSocket) {
                sockets[sockets.findIndex(i => i.token == token)].id = socket.id
            }

            jwt.verify(token, process.env.JWT_KEY, async (err, id) => {
                if (err)
                    return console.log("Error: Failure verifying Socket JWT")


                const foundUser = await User.findOne({ _id: id })

                if (!foundUser)
                    return console.log("Valid Socket JWT but invalid ID")

                sockets.push({
                    token: token,
                    user: foundUser,
                    id: socket.id
                })
            })
        })

        socket.on('disconnect', () => {
            // console.log("Socket Disconnected")
        })

        socket.on('loadMsgs', (server) => {
            for (var history of serverHistory)
                if (String(history.server) == String(server))
                    socket.emit('loadMsgs', history.msgs)
        })
    })
}

function verifyOldEmail(userId) {
    const socketData = sockets.find(i => String(i.user._id) == String(userId))

    if (!socketData)
        return console.log("Socket not connected")

    const socket = io.sockets.sockets.get(socketData.id)
    socket.emit("oldVerified")
}

function verifyNewEmail(userId) {
    const socketData = sockets.find(i => String(i.user._id) == String(userId))

    if (!socketData)
        return console.log("Socket not connected")

    const socket = io.sockets.sockets.get(socketData.id)
    socket.emit("newVerified")
}

function confirmEmailChange(userId) {
    const socketData = sockets.find(i => String(i.user._id) == String(userId))

    if (!socketData)
        return console.log("Socket not connected")

    const socket = io.sockets.sockets.get(socketData.id)
    socket.emit("confirmEmailChange")
}

const serverHistory = []
const messagesStored = 60
function sendChatMessage(userId, data) {
    const socketData = sockets.find(i => String(i.user._id) == String(userId))

    var serverFound = false
    for (var history of serverHistory) {
        if (String(history.server) == String(data.server)) {
            serverFound = true
            history.msgs.push(data)

            if (history.msgs.length > messagesStored)
                history.msgs.shift()
        }
    }

    if (!serverFound)
        serverHistory.push({
            server: String(data.server),
            msgs: [data]
        })

    if (!socketData)
        return console.log(`Socket ${userId} not connected (msg: ${data.msg})`)

    const socket = io.sockets.sockets.get(socketData.id)
    socket.emit('chatMsg', data)
}

module.exports = {
    setup,
    verifyOldEmail,
    verifyNewEmail,
    confirmEmailChange,
    sendChatMessage
}