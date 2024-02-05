require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const app = new express();
const port  = process.env.PORT || 3000;
const {Server} = require('socket.io');

app.use(cors());
const server = http.createServer(app);
const io = new Server(server ,{
    cors: {
        origin:'http://localhost:3000',
        methods: ['POST','GET'],
    },
});

io.on('connection', (socket)=>{
    console.log(`${socket.id} User Connected`);

    socket.on('joinRoom',(data)=>{
        socket.join(data);
        console.log(`User with ID ${socket.id} joined room ${data}`);
    });

    socket.on('sendMessage',(data)=>{
        socket.to(data.room).emit('receiveMessage',data);
    })

    socket.on('disconnect',()=>{
        console.log(`${socket.id} User Disconnected`);
    });
})

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});