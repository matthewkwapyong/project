'use strict'
require('dotenv').config()
let express = require('express')
let router = express();
let jwt = require('jsonwebtoken')
let generateAccessToken = require('../middleware/jwt').generateAccessToken

router.post('/refresh', (req, res) => {
    const refreshToken = req.body.refresh
    if (refreshToken == null) return res.sendStatus(401)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.refreshKey, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ id: user.id })
        res.json({ accessToken: accessToken })
    })
})
router.post("/verify", (req, res) => {
    jwt.verify(req.body.token, process.env.secretKey, (err, d) => {
        if (err) {
            if (err.name == "TokenExpiredError") {
                return res.status(401).json({ authenticated: false, expired: true })
            }
            return res.status(500).send()
        }
        res.json({ authenticated: true })
    })
})

module.exports = router