const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    plan: {
        storage: Number,
        serverSlots: Number,
        maxDataLife: Number
    }
})

const user = mongoose.model("User", userSchema)

module.exports = user