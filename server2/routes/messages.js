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
            return res.json({exists:true})
        }
        res.json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
})
module.exports = router