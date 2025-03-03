require('dotenv').config()
const express = require("express");
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);
const cors = require('cors');
let jwt = require('jsonwebtoken')
let pool = require('./db/connection')
let auth = require('./routes/authenticate')
let chat = require('./routes/messages')
let token = require('./routes/token')
let validateToken = require('./middleware/jwt').validateToken
let generateAccessToken = require('./middleware/jwt').generateAccessToken
let { checkInChat } = require('./db/db');

app.use(cors());
// app.use(express.urlencoded({ extended: true }));

const { Server } = require("socket.io");
const { send } = require('node:process');
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000  "
    }
});

async function addtomessage(sender, body, chat_id, date) {
    // console.log("hek",sender,body,chat_id,date)
    const client = await pool.connect()
    const query = `
    INSERT INTO messages (chat_id, sender, body, deleted_from_sender, deleted_from_receiver, read,created_at,edited)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    try {
        await client.query('BEGIN')
        const result = await client.query(query, [chat_id, sender, body, false, false, false, date,false]);
        const resut = await client.query('UPDATE chat SET updated_at = $1 WHERE id = $2', [date, chat_id]);

        await client.query('COMMIT')
        return { added: true, data: result.rows[0] }
    } catch (err) {
        await client.query('ROLLBACK')
        console.error('Error inserting message:', err);
        return { added: false }
    } finally {
        client.release()
    }

}

let rooms = {}
let onlineUsers = []
io.on('connection', (socket) => {
    socket.on('join', (room) => {
        console.log(room)
        if (rooms[room.id] && rooms[room.id].includes(socket.id)) {
        } else {
            if (!rooms[room.id]) {
                rooms[room.id] = [];
            }
            rooms[room.id].push(socket.id)
            socket.join(room.id)
        }
    })
    socket.on('typing', (data) => {
        console.log(data)
        io.in(data.room).emit('typing', data)
        socket.broadcast.emit('eventTyping', data.room)

        //   .emit('typing', "hello");
        // io.to(84).emit("typing", data)
    });
    socket.on('stoptyping', (data) => {
        // console.log(data)
        io.in(data.room).emit('stoptyping', data)
        socket.broadcast.emit('eventstopTyping', data.room)
    })
    socket.on("editmessage", async (data) => {
        console.log(data)
        const user = data.userid
        let chat_id = parseInt(data.chatid)
        let message_id = parseInt(data.id)
        let body = data.body
        const client = await pool.connect()
        try {
            const query = await checkInChat(chat_id, user)
            if (query.rowCount === 0) return { authorized: false };
            await client.query('UPDATE messages SET body = $1,edited = TRUE WHERE chat_id = $2 AND id = $3', [body, chat_id, message_id])
            await client.query('COMMIT')
            console.log("hello")
            io.to(data.chatid).emit('editedmessage', { userid: user, id: message_id,chat_id:chat_id,body:body,status:true })
        } catch (error) {
            console.log("sasa")
            io.to(data.chatid).emit('editedmessage', { status: false })
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    })
    socket.on("deleteMessage", async (data) => {
        //1 delete from sender only
        //2 completely delete the message
        //3 the receiver deletes the message
        // console.log(data)
        const user = data.user_id
        const { type } = data
        let chat_id = parseInt(data.chat_id)
        let message_id = parseInt(data.id)
        const client = await pool.connect()
        try {
            const query = await checkInChat(chat_id, user)
            if (query.rowCount === 0) return { authorized: false };
            if (type === 1) {
                await client.query('UPDATE messages SET deleted_from_sender = TRUE WHERE chat_id = $1 AND id = $2', [chat_id, message_id])
            } else if (type === 2) {
                await client.query('DELETE FROM messages WHERE chat_id = $1 AND id = $2', [chat_id, message_id])
            } else if (type === 3) {
                await client.query('UPDATE messages SET deleted_from_receiver = TRUE WHERE chat_id = $1 AND id = $2', [chat_id, message_id])
            }
            await client.query('COMMIT')
            console.log("gotten")
            io.to(data.chat_id).emit('deletemessage', { userid: user, type: type, deleted: true, id: message_id })
        } catch (error) {
            io.to(data.chat_id).emit('deletemessage', { deleted: false })
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    })
    io.on('connection', (data) => {
        // console.log("a user connected")
    })
    // console.log(`Client connected: ${socket.id}`);

    // Listen for disconnect events
    socket.on('disconnect', () => {
        //   console.log(`Client disconnected: ${socket.id}`);
    });
    socket.on('conn', (data) => {
        if (Object.keys(data).length !== 0) {
            if (onlineUsers.length === 0) {
                onlineUsers.push({ socketid: socket.id, auth, user: data })
                return;
            }
            for (let i of onlineUsers) {
                if (i.user.id === data.id) {
                } else {
                    onlineUsers.push({ socketid: socket.id, auth, user: data })
                }
            }
        }
    })
    socket.on('message', async (data) => {
        let message = await addtomessage(data.sender.user.id, data.text, data.room, data.date)
        console.log(message)
        if (message.added) {
            io.emit('newmessage', message)
        }
        io.to(data.room).emit('chat', message)
    });
});
app.use(express.json())
app.use('/auth', auth)
app.use('/chat', chat)
app.use('/token', token)
app.get('/user', validateToken, async (req, res) => {
    let user_id = req.tokenData.id
    let text = 'SELECT id,firstname,lastname,username FROM users WHERE id = $1'
    let data = await pool.query(text, [user_id])
    // console.log(data)
    return res.json({user:data.rows[0]})
})
app.get('/search/:text', async (req, res) => {
    let tex = req.params.text
    let text = `SELECT id,firstname,lastname,username FROM users WHERE username like $1`
    let data = await pool.query(text, [`${tex}%`])
    return res.json(data.rows)
})
const PORT = 3001;
server.listen(PORT, () => console.log(`My first Express app - listening on port ${PORT}!`));
