const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = function loggedIn(req, res, next) {
    const { token } = req.cookies
    jwt.verify(token, process.env.JWT_KEY, async (err, id) => {
        if (err) {
            console.log("Error: Failure verifying JWT")
            return res.status(401).send()
        }

        const foundUser = await User.findOne({ _id: id })

        if (!foundUser) {
            console.log("Valid JWT but invalid ID")
            return res.status(401).send()
        }

        req.user = foundUser
        next()
    })
}