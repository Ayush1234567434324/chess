import React, { useState, useEffect } from "react";
import { Card, CardContent, List, ListItem, ListItemText, ListSubheader, Stack, Typography, Box, TextField, Button } from "@mui/material";
// Assuming Chessboard component is imported from somewhere
import Board from "./component/Board/board";
import CustomDialog from "./component/CustomDialog";
import socket from './socket';

function Game({ room, fen, onDrop, orientation, players, over, setOver }) {
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Function to handle sending a message
  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      // Emit a 'message' event to the server with the message content
      socket.emit('message', { roomId: room, message: messageInput });
      console.log(players)
      setMessageInput('');
    }
  };

  useEffect(() => {
    // Listen for incoming messages
    const handleMessage = (messageData) => {
      // Add the received message to the chatMessages state
      setChatMessages(prevMessages => [...prevMessages, messageData]);
    };
    socket.on('message', handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('message', handleMessage);
    };
  }, []);

  return (
    <Stack>
      <Card>
        <CardContent>
          <Typography variant="h5">Room ID: {room}</Typography>
        </CardContent>
      </Card>
      <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
        <div className="board" style={{ maxWidth: 600, maxHeight: 600, flexGrow: 1 }}>
          <Board
          room = {room}
          players = {players.length}
         
          />
        </div>
        {players.length > 0 && (
          <Box>
            <List>
              <ListSubheader>Players</ListSubheader>
              {players.map((p) => (
                <ListItem key={p.id}>
                  <ListItemText primary={p.username} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Stack>
      <CustomDialog // Game Over CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          setOver("");
        }}
      />
      {/* Chat UI */}
      <Stack direction="row" spacing={1} sx={{ pt: 10, px: 2 }}>
        <TextField
          label="Message"
          variant="outlined"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          fullWidth
        />
        <Button style={{width:'70px',height:'50px'}} variant="contained" onClick={sendMessage}>Send</Button>
      </Stack>
      {/* Display chat messages */}
      <Box sx={{ pt: 2, px: 2 }}>
        <List>
          {chatMessages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${message.username}: ${message.message}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  );
}

export default Game;
