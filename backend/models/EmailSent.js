const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    body: Object,
    code: Number,
    email: String
})

const emailSent = mongoose.model("EmailSent", emailSchema)

module.exports = emailSent