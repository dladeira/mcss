const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const config = require('config')

const User = require('../models/User')
const EmailSent = require('../models/EmailSent')
const loggedIn = require('../middleware/loggedIn')

const resetEmailRouter = require('./reset-email')

const pwdResetCodes = []

router.use('/reset-email', resetEmailRouter)

router.post('/user', loggedIn(true), (req, res) => {    
    req.user.password = undefined

    res.status(200).json({ user: req.user })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const foundAccount = await User.findOne({ email: email }).lean()

    if (!foundAccount) {
        return res.status(400).json({ error: "Invalid username or password" })
    }

    const password_correct = await bcrypt.compare(password, foundAccount.password)

    if (!password_correct) {
        return res.status(400).json({ error: "Invalid username or password" })
    }

    const token = jwt.sign(foundAccount._id.toString(), process.env.JWT_KEY)

    return res.status(200).json({ token: token })
})

router.post('/register', async (req, res) => {
    const { email, password, password2, tos } = req.body

    if (password != password2)
        return res.status(400).json({ error: "Passwords do not match" })

    if (validatePassword(password))
        return res.status(400).send({ error: validatePassword(password) })

    if (!tos)
        return res.status(400).send({ error: "Please read and agree to the terms of service"})

    let code = Math.round(Math.random() * 1000000000)

    let existingEmail = await User.findOne({ email: email })

    if (existingEmail)
        return res.status(400).json({ error: "Email already exists" })

    let existingSent = await EmailSent.findOne({ email: email })

    if (existingSent)
        return res.status(400).json({ error: "Email already sent" })

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

        let message = {
            from: 'MCSS <mcss@ladeira.eu',
            to: `<${email}>`,
            subject: 'Account Creation - Email Verification',
            html: `To finish creating your account, verify your email by clicking the link below<br><br><a href="${process.env.ORIGIN}/api/auth/verify-email?code=${code}">Verify Email</a>`
        }

        await transporter.sendMail(message)
    } catch (e) {
        return res.status(400).json({ error: "Invalid email address" })
    }

    let emailSent = new EmailSent({
        body: req.body,
        code: code,
        email: email
    })

    await emailSent.save()

    return res.status(200).json({ success: true })
})

router.get('/verify-email', async (req, res) => {
    let info = await EmailSent.findOne({ code: req.query.code })

    if (!info)
        return res.status(400).json({ invalid: true })

    const { email, password } = info.body

    const existingEmail = await User.findOne({ email: email })
    if (existingEmail)
        return res.status(400).send("Email already in use")

    const hash = await bcrypt.hash(password, 10)

    let user = await new User({
        email: email,
        password: hash,
        plan: config.get('plans.free')
    }).save()

    const token = jwt.sign(user._id.toString(), process.env.JWT_KEY)

    await EmailSent.deleteOne({ code: req.query.code })

    res.cookie("token", token, {
        maxAge: 2592000,
        sameSite: 'lax'
    })

    return res.status(200).redirect('/u/servers')
})

router.post('/pwd-change', loggedIn(), async (req, res) => {
    const { old, new1, new2 } = req.body

    if (new1 != new2) {
        return res.status(400).json({ error: "Passwords do not match" })
    }

    const correct = await bcrypt.compare(old, req.user.password)

    if (!correct) {
        return res.status(400).json({ error: "Old password incorrect" })
    }

    if (validatePassword(new1))
        return res.status(400).send({ error: validatePassword(new1) })

    const hash = await bcrypt.hash(new1, 10)

    const user = await User.findOne({ _id: req.user._id })
    user.password = hash
    await user.save()

    return res.status(200).json({ success: true })
})

router.post('/pwd-reset', async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email: email })

    if (!user)
        return res.status(400).json({ error: "Email not found" })

    const code = Math.round(Math.random() * 1000000)

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

        let message = {
            from: 'MCSS <mcss@ladeira.eu',
            to: `<${email}>`,
            subject: 'Account Retrieval - Password Reset',
            html: `To reset your password, click the link and follow the steps<br><br><a href="${argv["origin"]}/login/reset-pwd-link?code=${code}">Reset Password</a>`
        }
        bcrypt.hash
        await transporter.sendMail(message)
    } catch (e) {
        return res.status(400).json({ error: "Invalid email address" })
    }

    pwdResetCodes.push({
        user: user._id,
        code: code
    })

    return res.status(200).json({ success: "Check your email" })
})

router.post('/pwd-reset-link', async (req, res) => {
    const { password, code } = req.body

    const reset = pwdResetCodes.find(i => i.code == code)

    if (!reset)
        return res.status(400).send({ error: "Invalid code" })

    if (validatePassword(password))
        return res.status(400).send({ error: validatePassword(password) })

    const user = await User.findOne({ _id: reset.user._id })
    user.password = await bcrypt.hash(password, 10)
    await user.save()

    return res.status(200).send({ success: "Password changed, please sign in again" })
})

function validatePassword(password) {
    if (password.length < 4) {
        return "Password too short"
    }
}

module.exports = router