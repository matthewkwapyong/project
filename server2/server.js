require('dotenv').config()
const express = require("express");
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);
const cors = require('cors');

app.use(cors());
// app.use(express.urlencoded({ extended: true }));

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000  "
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (data) => {
        console.log(data);
      });
  });
  





let lof = require('./routes/authenticate')
app.use(express.json())
app.use('/api',lof)





// let m = jwt.sign("mello","matt")
// jwt.verify(m, 'matt', function(err, decoded) {
    
//   });
  
app.get("/", (req, res) => res.send("Hello, world!"));

app.use('/',()=>{
    console.log(
        "req"
    )
})
const PORT = 3001;
server.listen(PORT, () => console.log(`My first Express app - listening on port ${PORT}!`));
