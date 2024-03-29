const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = function loggedIn(allowDemo = false) {
    return (req, res, next) => {
        if (req.body.demo && allowDemo) {
            req.demo = true
            req.user = {
                email: 'demo@mcss.ladeira.eu',
                plan: {
                    storage: 10,
                    serverSlots: 3,
                    maxDataLife: 3
                }
            }
            return next()
        }

        var { token } = req.cookies

        if (!token)
            token = req.body.token

        jwt.verify(token, process.env.JWT_KEY, async (err, id) => {
            if (err) {
                // console.log("Error: Failure verifying JWT")
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
}