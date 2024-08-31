// server.js
const express = require('express');
const { Server } = require("socket.io");
const { v4: uuidV4 } = require('uuid');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: '*',
});
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');

  socket.on('username', (username) => {
    console.log(username);
    socket.data.username = username;
  });

  socket.on('createRoom', async (roomId) => {
    await socket.join(roomId);

    rooms.set(roomId, {
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }]
    });
  });

  socket.on('joinRoom', async (roomId, callback) => {
    const room = rooms.get(roomId);
    let error, message;
  
  
    if (!room) {
      error = true;
      message = 'Room does not exist';
    } else if (room.players.length >= 2) {
      error = true;
      message = 'Room is full';
    }
  
    if (error) {
      if (typeof callback === 'function') {
        callback({
          error,
          message
        });
      }
      return;
    }
  
    await socket.join(roomId);
  
    const roomUpdate = {
      ...room,
      players: [
        ...room.players,
        { id: socket.id, username: socket.data?.username },
      ],
    };
  
    rooms.set(roomId, roomUpdate);
  
    if (typeof callback === 'function') {
      callback(roomUpdate);
    }
  
    socket.to(roomId).emit('opponentJoined', roomUpdate);
  });

  // Listen for chat messages
  socket.on('message', (messageData) => {
    const { roomId, message } = messageData;
    io.to(roomId).emit('message', { username: socket.data.username, message });
  });

  socket.on('move', (moveData) => {
    const { roomId, move, player } = moveData;
    console.log(moveData);
  
    // Reverse the move array and each row within the move array
    
  
    // Emit the reversed move array
    io.to(roomId).emit('move', { move, player });
  });
  
  
  

});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
