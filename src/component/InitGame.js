// src/components/InitGame.js
import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CustomDialog from "./CustomDialog";
import socket from '../socket';
import { v4 as uuidV4 } from 'uuid';

export default function InitGame({ setRoom, setOrientation, setPlayers }) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState('');
  const [roomError, setRoomError] = useState('');

  const handleJoinRoom = () => {
    if (!roomInput.trim()) {
      setRoomError('Room ID cannot be empty');
      return;
    }

    socket.emit('joinRoom', roomInput.trim(), (response) => {
      if (response.error) {
        setRoomError(response.message);
      } else {
        setRoom(roomInput.trim());
        setRoomDialogOpen(false);
      }
    });
  };

  const handleCreateRoom = () => {
    const newRoom = uuidV4();
    setRoom(newRoom);
    setOrientation('white');
    setPlayers([]);

    socket.emit('createRoom', newRoom);
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, height: "100vh" }}
    >
      <CustomDialog
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Select Room to Join"
        contentText="Enter a valid room ID to join the room"
        handleContinue={handleJoinRoom}
      >
        <TextField
          autoFocus
          margin="dense"
          id="room"
          label="Room ID"
          name="room"
          value={roomInput}
          required
          onChange={(e) => setRoomInput(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(roomError)}
          helperText={!roomError ? 'Enter a room ID' : roomError}
        />
      </CustomDialog>
      <Button
        variant="contained"
        onClick={handleCreateRoom}
      >
        Start a game
      </Button>
      <Button
        onClick={() => setRoomDialogOpen(true)}
      >
        Join a game
      </Button>
    </Stack>
  );
}
