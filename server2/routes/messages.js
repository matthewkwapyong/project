'use strict'
require('dotenv').config()
let express = require('express')
let router = express();
let jwt = require('jsonwebtoken')
let pool = require('../db')
let { validateToken } = require('../middleware/jwt')


//request to message



let room = {
    id: "",
    members: []
}
function check(room, userid) {
    //checks if user in chat
}

async function joinroom() {
    l
}

async function get_user(user_id) {
    let text = 'SELECT id,firstname,lastname,username FROM users WHERE id = $1'
    let data = await pool.query(text, [user_id])
    return data
}


async function getChat(chat_id) {
    try {
        let chat_query = await pool.query("SELECT * FROM chat WHERE id = $1", [chat_id])
        let members_query = await pool.query("SELECT * FROM chatmembers WHERE chat_id = $1", [chat_id])
        let members = []
        for (let i of members_query.rows) {
            let member_data = await get_user(i.user_id)
            members.push(member_data.rows[0])
        }
        return {
            chat: chat_query.rows[0],
            members: members
        }
    } catch (error) {
        throw error
    }
}
async function checkIfChatExists(user1, user2) {
    const text = `SELECT c.id AS chat_id , m1.user_id as user1 , m2.user_id as user2
                    FROM chat c
                    JOIN chatmembers m1 ON c.id = m1.chat_id
                    JOIN chatmembers m2 ON c.id = m2.chat_id
                    WHERE m1.user_id = $1
                    AND m2.user_id = $2
                    AND c.id IN (
                        SELECT chat_id FROM chatmembers GROUP BY chat_id HAVING COUNT(*) = 2
                    )
                LIMIT 1;`
    const result = await pool.query(text, [user1, user2])
    return result
}
async function addusertochat(client, user_id, chat_id) {
    try {
        const query = 'INSERT INTO chatmembers(chat_id,user_id) VALUES ($1, $2) RETURNING *'
        const data2 = await client.query(query, [chat_id, user_id])
        return data2.rows
    } catch (error) {
        return error
    }
}
//checks if user is in chat
async function checkinChat(chat_id, user_id) {
    let text = `SELECT c.id AS chat_id , m1.user_id as user1 FROM chat c
                JOIN chatmembers m1 ON c.id = m1.chat_id
                WHERE m1.user_id = $1 and c.id = $2`
    let query = await pool.query(text, [user_id, chat_id])
    return query
}
async function getuserChat(user_id) {
    let userc = await pool.query('SELECT id FROM chatmembers m join chat c on c.id = m.chat_id WHERE user_id = $1', [user_id])
    let user_chats = []
    for (let i of userc.rows) {
        let chats = await getChat(i.id)
        user_chats.push(chats)
    }
    return user_chats
}
router.get("/chats", validateToken, async (req, res) => {
    const requestor = req.tokenData.id
    try {
        let messages = await getuserChat(requestor)
        res.json(messages)
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
})

router.get("/messages/list/:id", validateToken, async (req, res) => {
    const chat_id = req.params.id
    const requestor = req.tokenData.id
    try {
        const que = await checkinChat(chat_id, requestor)
        if (que.rowCount === 0) return res.status(401).send();
        let messages = await pool.query('SELECT * FROM messages WHERE chat_id = $1', [chat_id])
        res.json(messages.rows)
    } catch (error) {
        return res.status(500).send()
    }
})
router.post("/create", validateToken, async (req, res) => {
    const client = await pool.connect()
    try {
        // let owner = req.body.tokenData
        let { sender, receiver } = req.body
        // let main = get_user(receiver)
        // let other = get_user(receiver)
        let exists = await checkIfChatExists(sender, receiver)
        if (exists.rowCount === 0) {
            await client.query('BEGIN')

            let date = new Date()
            let text = 'INSERT INTO chat(created_at,name,description,owner) VALUES ($1, $2, $3, $4) RETURNING *'
            let data = await client.query(text, [date, "chat", "", sender])
            let chat_id = data.rows[0].id
            await addusertochat(client, sender, chat_id)
            await addusertochat(client, receiver, chat_id)
            let chat_info = data.rows
            await client.query('COMMIT')
            res.json({ chat_info })
        } else {
            res.json({ exists: true })
        }
    } catch (error) {
        await client.query('ROLLBACK')
        if (error) {
            console.log(error)
            if (error.code == '23505') {
                res.json({ exits: true })
            }
        }
    } finally {
        client.release()
    }
    //tbh ill just make the chat id combination of th userid    
})
module.exports = router