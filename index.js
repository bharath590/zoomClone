const express = require('express');
const app = express();
const server = require('http').createServer(app);

const  {ExpressPeerServer} = require('peer')
var options = {
    debug: true
}
const peerServer = ExpressPeerServer(server, options);
app.use('/peerjs', peerServer);
const { v4: uuidv4 } = require('uuid');

app.set("view engine", 'ejs');
app.use(express.static('public'));

const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
})  
io.on('connection', socket => {
    socket.on('join-room',(roomId,userId)=>{
       socket.join(roomId);
       socket.to(roomId).broadcast.emit('user-connected',userId);
       socket.on('message',message => {
           
           io.to(roomId).emit('createMessage',message);
       })
    })
})


server.listen(process.env.PORT || 3000);

