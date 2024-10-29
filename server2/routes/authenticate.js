'use strict'
require('dotenv').config()
let express = require('express')
let router = express();
let jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
let pool = require('../db/connection');
const { generateAccessToken } = require('../middleware/jwt');
const saltRounds = 10;

async function checkUserExists(id,email) {
    const query = await pool.query('SELECT username,email from users where username = $1 OR email = $2', [id,email])
    if (query.rowCount > 0) {
        return true;
    }
    return false;
}
router.post('/login', async (req, res) => {
    // 0 = notfound 1 wrong password
    const { username, password } = req.body
    try {
        const query = await pool.query('SELECT id,username,password from users where username = $1', [username])
        if (query.rowCount == 0) return res.json({ authenticated: false, type: 0 });
        let storedPassword = query.rows[0].password
        let result = await bcrypt.compare(password, storedPassword)
        if (result) {
            const cookieMaxAge = new Date();
            cookieMaxAge.setTime(cookieMaxAge.getTime() + (1 * 24 * 60 * 60 * 1000));
            var token = generateAccessToken({ id: query.rows[0].id });
            const refreshToken = jwt.sign({ id: query.rows[0].id }, process.env.refreshKey)
            res.json({ authenticated: true, token, maxAge: cookieMaxAge, refresh: refreshToken })    
        } else {
            res.json({ authenticated: false, type: 1 })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
})
router.post('/create', async (req, res) => {
    let {
        firstname,
        lastname,
        email,
        username,
        password,
        created
    } = req.body;
    if (await checkUserExists(username,email)) return res.json({ exists: true });
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const text = 'INSERT INTO users(email,firstname,lastname,username,password,created) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        const values = [email, firstname, lastname, username, hashedPassword, created]
        const query = await pool.query(text, values)
        const cookieMaxAge = new Date();
        cookieMaxAge.setTime(cookieMaxAge.getTime() + (1 * 24 * 60 * 60 * 1000));
        const token = generateAccessToken({ id: query.rows[0].id })
        const refreshToken = jwt.sign({ id: query.rows.id }, process.env.refreshKey)
        res.json({ created: true, token, maxAge: cookieMaxAge, refresh: refreshToken })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ created: false, error: 'Internal server error' });
    }
})
module.exports = router