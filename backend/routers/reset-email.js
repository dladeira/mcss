const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer')
const argv = require('minimist')(process.argv.slice(2))

const User = require('../models/User')
const loggedIn = require('../middleware/loggedIn')
const socket = require('../socket')

var confirmations = []

router.post('/old', loggedIn, async (req, res) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.ladeira.eu",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        let code = Math.round(Math.random() * 1000000000)

        let message = {
            from: 'MCSS <mcss@ladeira.eu',
            to: `<${req.user.email}>`,
            subject: 'Email Change - Old Verification',
            html: `To change your email, you need to verify both your new and old email.<br>To verify your old email, press the link below<br><br><a href="${argv['origin']}/api/auth/reset-email/verify?code=${code}">Verify</a>`
        }

        await transporter.sendMail(message)

        confirmations.push({
            code: code,
            old: true,
            email: req.user.email,
            confirmed: false,
            user: req.user._id
        })

        return res.status(200).json({ success: true })
    } catch {
        return res.status(400).json({ invalid: true })
    }
})

router.get('/verify', loggedIn, async (req, res) => {
    const { code } = req.query

    var index = confirmations.findIndex(i => i.code == code)

    if (index == -1)
        return res.status(400).send("Invalid code")

    if (confirmations[index].confirmed == true)
        return res.status(400).send("Email already verified")

    confirmations[index].confirmed = true

    if (confirmations[index].old)
        socket.verifyOldEmail(req.user._id)
    else
        socket.verifyNewEmail(req.user._id)

    const oldEmail = confirmations.find(i => String(i.user) == String(req.user._id) && i.old == true && i.confirmed)
    const newEmail = confirmations.find(i => String(i.user) == String(req.user._id) && i.old == false && i.confirmed)

    if (oldEmail && newEmail) {
        const user = await User.findOne({ _id: req.user._id })
        user.email = newEmail.email
        await user.save()

        confirmations = confirmations.filter(i => String(i.user) != String(req.user._id))

        socket.confirmEmailChange(req.user._id)
    }

    return res.status(200).send("Email verified. You can close this page now")
})

router.post('/new', loggedIn, async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email: email })

    if (user)
        return res.status(400).json({ error: "Email already in use" })

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.ladeira.eu",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        let code = Math.round(Math.random() * 1000000000)

        let message = {
            from: 'MCSS <mcss@ladeira.eu',
            to: `<${email}>`,
            subject: 'Email Change - New Verification',
            html: `To change your email, you need to verify both your new and old email.<br>To verify your new email, press the link below<br><br><a href="${argv['origin']}/api/auth/reset-email/verify?code=${code}">Verify</a>`
        }

        await transporter.sendMail(message)

        confirmations.push({
            code: code,
            old: false,
            email: email,
            confirmed: false,
            user: req.user._id
        })

        return res.status(200).json({ success: true })
    } catch {
        return res.status(400).json({ invalid: true })
    }

})

module.exports = router