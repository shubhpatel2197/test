require('./Db/controller');
const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const CORS = require('cors');
const http = require("http");
const socket = require("socket.io");

dotenv.config();

const app = express();
const port = 4000;
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(CORS({
    origin: '*',
}));
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Routes
const grproute = require('./Routes/groups');
app.use(grproute);

const users = {};
const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            console.log("1")
            console.log(socket.id)
            users[roomID].push(socket.id);
        } else {
            console.log("2")
            console.log(socket.id)
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

server.listen(port, () => {
    console.log("Server is ON at " + port);
});

module.exports = server;
