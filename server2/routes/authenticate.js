'use strict'
require('dotenv').config()
let express = require('express')
let router = express();
let jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
let pool = require('../db')

async function checkUserExists(id) {
    console.log(id)
    const row = await pool.query('SELECT username from users where username = $1', [id])
    console.log(row.row)
    console.log(row.rowCount > 0)
    if (row.rowCount > 0) {
        return true;
    }
    return false;
}

router.post('/login', async (req, res) => {
    // 0 = notfound 1 wrong password
    const { username, password } = req.body
    try {
        const row = await pool.query('SELECT id,username,password from users where username = $1', [username])
        if (row.rowCount == 0) return res.json({ authenticated: false, type: 0 });
        let storedPassword = row.rows[0].password
        let result = await bcrypt.compare(password, storedPassword)
        console.log(result)
        if (result) {
            var token = jwt.sign({ id: row.rows[0].id }, process.env.secretKey, { expiresIn: '2d' });
            res.json({ authenticated: true, token })
        } else {
            res.json({ authenticated: false, type: 1 })
        }
    } catch (error) {
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
    if (await checkUserExists(username)) return res.json({ exists: true });
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let date = new Date()
        let text = 'INSERT INTO users(email,firstname,lastname,username,password,created) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        let values = [email, firstname, lastname, username, hashedPassword, date]
        const row = await pool.query(text, values)
        var token = jwt.sign({ id: row.rows.id }, process.env.secretKey, { expiresIn: '2d' });
        res.json({ created: true, token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ created: false, error: 'Internal server error' });
    }
})
module.exports = router