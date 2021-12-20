const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });

whole_data = []
app.use(cors())

let changed = 0;
let count = 0
let size_total = 0;
io.on("connection", socket => {
    socket.on("hello", (args) => {
        console.log('args: ', args)
    })

    socket.on('blobdata', (data) => {
        whole_data = [...whole_data, data]
        size_total +=  data.byteLength;
        if(whole_data.length === 100){
            console.log(count,size_total,whole_data.length)
            socket.emit("getblobs", whole_data)
            changed= false
            count++
            whole_data = []
        }
        
        
    })

    socket.on("ping", () => {
        // for (let i = 0; i < 100; i++) {
            socket.emit("test", 1)        
        // }
    })
    

})

httpServer.listen(3000, () => {
    console.log('socket server listening on *:3000');
});