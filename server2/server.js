require('dotenv').config()
const express = require("express");
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);
const cors = require('cors');
let jwt = require('jsonwebtoken')
let pool = require('./db')
let auth = require('./routes/authenticate')
let chat = require('./routes/messages')
let token = require('./routes/token')
let validateToken = require('./middleware/jwt').validateToken
let generateAccessToken = require('./middleware/jwt').generateAccessToken


app.use(cors());
// app.use(express.urlencoded({ extended: true }));

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000  "
    }
});
let rooms = []
io.on('connection', (socket) => {
    socket.on('message', (data) => {
        console.log(data)
        io.sockets.in(data.room).emit("chat",data.text);
    });
    socket.on('join', (room)=>{
        console.log("joing room")
        socket.join(room.id)
        rooms.push(room)
    })
    socket.on('disconnect',(data)=>{

    })
});
let g = {
    action:"",
    content:"",
    token:""
}
app.use(express.json())
app.use('/api', auth)
app.use('/chat',chat)
app.use('/token',token)
app.get('/user',validateToken,async (req,res)=>{
    let user_id =  req.tokenData.id
    let text = 'SELECT id,firstname,lastname,username FROM users WHERE id = $1'
    let data = await pool.query(text, [user_id])
    return res.json(data.rows[0])
})

const PORT = 3001;
server.listen(PORT, () => console.log(`My first Express app - listening on port ${PORT}!`));
