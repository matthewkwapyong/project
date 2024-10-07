'use strict'
let pool = require('./connection')

async function getUser(user_id) {
    let text = 'SELECT id,firstname,lastname,username FROM users WHERE id = $1'
    let data = await pool.query(text, [user_id])
    return data
}
async function getChatMembers(chat_id) {
    try {
        let members_query = await pool.query("SELECT * FROM chatmembers WHERE chat_id = $1", [chat_id])
        let members = []
        for (let i of members_query.rows) {
            let member_data = await getUser(i.user_id)
            members.push(member_data.rows[0])
        }
        return members
    } catch (error) {
        throw error
    }
}
async function getChat(chat_id,user_id) {
    try {
        let chat_query = await pool.query("SELECT * FROM chat WHERE id = $1", [chat_id])
        let members_query = await pool.query("SELECT * FROM chatmembers WHERE chat_id = $1", [chat_id])
        let members = []
        let name = ""
        for (let i of members_query.rows) {
            let member_data = await getUser(i.user_id)
            members.push(member_data.rows[0])
        }
        let item1 = members[0]
        let item2 = members[1]
        if (item1.id == user_id) name = item2.username
        else if (item2.id == user_id)  name = item1.username 
        chat_query.rows[0].name = name
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
async function addUserToChat(client, user_id, chat_id) {
    console.log(user_id)
    try {
        const query = 'INSERT INTO chatmembers(chat_id,user_id) VALUES ($1, $2) RETURNING *'
        const data2 = await client.query(query, [chat_id, user_id])
        return data2.rows
    } catch (error) {
        throw error
    }
}
//checks if user is in chat
async function checkInChat(chat_id, user_id) {
    let text = `SELECT c.id AS chat_id , m1.user_id as user1 FROM chat c
                JOIN chatmembers m1 ON c.id = m1.chat_id
                WHERE m1.user_id = $1 and c.id = $2`
    let query = await pool.query(text, [user_id, chat_id])
    return query
}
async function getUserChats(user_id) {
    let userc = await pool.query('SELECT id FROM chatmembers m join chat c on c.id = m.chat_id WHERE user_id = $1 ORDER BY updated_at DESC', [user_id])
    let user_chats = []
    for (let i of userc.rows) {
        let chats = await getChat(i.id,user_id)
        user_chats.push(chats)
    }
    return user_chats
}
async function createChat(sender, receiver) {
    const client = await pool.connect()
    try {
        let exists = await checkIfChatExists(sender, receiver)
        if (exists.rowCount === 0) {
            await client.query('BEGIN')
            let date = new Date()
            let text = 'INSERT INTO chat(created_at,name,description,owner) VALUES ($1, $2, $3, $4) RETURNING *'
            let data = await client.query(text, [date, "chat", "", sender])
            let chat_id = data.rows[0].id
            let user1 = await addUserToChat(client, sender, chat_id)
            let user2 = await addUserToChat(client, receiver, chat_id)
            let member1 = await getUser(user1[0].user_id)
            let member2 = await getUser(user2[0].user_id)
            let chat_info = { chat: data.rows[0], members: [member1.rows[0], member2.rows[0]] }
            await client.query('COMMIT')
            return { exists: false, chat_info }
        } else {
            return { exists: true }
        }
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}
async function getChatList(chat_id, requestor) {
    try {
        const query = await checkInChat(chat_id, requestor)
        if (query.rowCount === 0) return { authorized: false };
        let messages = await pool.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at asc', [chat_id])
        return { authorized: true, messages: messages.rows }
    } catch (error) {
        throw error
    }
}

module.exports = {
    getChat,
    getUser,
    getUserChats,
    checkIfChatExists,
    checkInChat,
    addUserToChat,
    createChat,
    getChatList
}