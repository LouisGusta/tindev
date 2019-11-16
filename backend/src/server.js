const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://tinDev:121433@myserver-7oojp.mongodb.net/tinDev?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

// METODOS PRINCIPAIS DO HTTP REST
// GET, POST, PUT, DELETE

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);

// MVC -> M - model , V - View , C - Controller