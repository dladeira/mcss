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

module.exports = {
    setup,
    verifyOldEmail,
    verifyNewEmail,
    confirmEmailChange
}