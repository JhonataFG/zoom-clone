const { Socket } = require('dgram');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuid4V } = require('uuid')

const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 3001, path: '/peerjs' });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res, next) => {
    res.redirect(`/${uuid4V()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        })
    })

})

server.listen(3000);