const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const loggedIn = require('../middleware/loggedIn')

router.get('/user', loggedIn, (req, res) => {
    res.status(200).json({ user: req.user })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const foundAccount = await User.findOne({ email: email })

    if (!foundAccount) {
        return res.status(400).json({ invalid_login: true })
    }

    const password_correct = await bcrypt.compare(password, foundAccount.password)

    if (!password_correct) {
        return res.status(400).json({ invalid_login: true })
    }

    const token = jwt.sign(foundAccount._id.toString(), process.env.JWT_KEY)

    return res.status(200).json({ token: token })
})

router.post('/register', async (req, res) => {
    const { email, password, password2 } = req.body

    if (password != password2) {
        return res.status(400).json({ no_match: true })
    }

    const hash = await bcrypt.hash(password, 10)

    let user = await new User({
        email: email,
        password: hash
    }).save()

    console.log(user._id.toString())

    const token = jwt.sign(user._id.toString(), process.env.JWT_KEY)

    return res.status(200).json({ token: token })
})

module.exports = router