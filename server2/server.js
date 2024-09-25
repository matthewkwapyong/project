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
    const query = `
    INSERT INTO messages (chat_id, sender, body, deleted_from_sender, deleted_from_receiver, read,created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
    try {
        const result = await pool.query(query, [chat_id, sender, body, false, false, false, date]);
        return result.rows[0]
    } catch (err) {
        console.error('Error inserting message:', err);
    }
};

let rooms = {}
io.on('connection', (socket) => {

    socket.on('join', (room) => {
        if (rooms[room.id] && rooms[room.id].includes(socket.id)) {
        } else {
            if (!rooms[room.id]) {
                rooms[room.id] = [];
            }
            console.log(room)
            rooms[room.id].push(socket.id)
            socket.join(room.id)
        }
    })
    socket.on('typing', (data) => {
        io.in(data.room).emit('typing', data)
        //   .emit('typing', "hello");
        // io.to(84).emit("typing", data)
    });
    socket.on('stoptyping', (data) => {
        // console.log(data)
        io.in(data.room).emit('stoptyping', data)
    })
    socket.on('disconnect', (data) => {

    })
    socket.on('message', async (data) => {
        let g = await addtomessage(data.sender.id, data.text, data.room, data.date)
        io.to(data.room).emit('chat', g)
    });
});
app.use(express.json())
app.use('/api', auth)
app.use('/chat', chat)
app.use('/token', token)
app.get('/user', validateToken, async (req, res) => {
    let user_id = req.tokenData.id
    let text = 'SELECT id,firstname,lastname,username FROM users WHERE id = $1'
    let data = await pool.query(text, [user_id])
    return res.json(data.rows[0])
})
app.get('/search/:text', async (req, res) => {
    let tex = req.params.text
    let text = `SELECT id,firstname,lastname,username FROM users WHERE username like $1`
    let data = await pool.query(text, [`${tex}%`])
    return res.json(data.rows)
})
const PORT = 3001;
server.listen(PORT, () => console.log(`My first Express app - listening on port ${PORT}!`));
