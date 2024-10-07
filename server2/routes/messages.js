'use strict'
require('dotenv').config()
let express = require('express')
let router = express();
let jwt = require('jsonwebtoken')
let pool = require('../db/connection')
let { validateToken } = require('../middleware/jwt')
let {
    getChat,
    getUser,
    getUserChats,
    checkIfChatExists,
    checkInChat,
    addUserToChat,
    createChat,
    getChatList,
} = require('../db/db')

//
//1 delete sender message only for sender
//2 delete for both sender and receiver
//3 delete only for receiver
router.post("/remove", validateToken, async (req, res) => {
    const user = req.tokenData.id
    const {type } = req.body
    let chat_id = parseInt(req.body.chat_id)
    let message_id = parseInt(req.body.id)
    const client = await pool.connect()
    try {
        const query = await checkInChat(chat_id, user)
        if (query.rowCount === 0) return { authorized: false };
        if (type === 1) {
            console.log("gotten")
            await client.query('UPDATE messages SET deleted_from_sender = TRUE WHERE chat_id = $1 AND id = $2', [chat_id, message_id])
        } else if (type === 2) {
            await client.query('DELETE FROM messages WHERE chat_id = $1 AND id = $2', [chat_id, message_id])
        }else if (type === 3){
            await client.query('UPDATE messages SET deleted_from_receiver = TRUE WHERE chat_id = $1 AND id = $2', [chat_id, message_id])
        }
        await client.query('COMMIT')
        res.json({ deleted: true ,id:message_id})
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }

})
router.get("/chats", validateToken, async (req, res) => {
    const requestor = req.tokenData.id
    try {
        let messages = await getUserChats(requestor)
        res.json(messages)
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
})

router.get("/chats/:id/messages", validateToken, async (req, res) => {
    const chat_id = req.params.id
    const requestor = req.tokenData.id
    try {
        let list = await getChatList(chat_id, requestor)
        if (list.authorized) {
            res.json(list.messages)
        }
    } catch (error) {
        return res.status(500).send()
    }
})
router.post("/create", validateToken, async (req, res) => {
    let sender = req.tokenData.id
    let { receiver } = req.body
    try {
        let result = await createChat(sender, receiver)
        if (result.exists) {
            return res.json({ exists: true })
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
})
module.exports = router