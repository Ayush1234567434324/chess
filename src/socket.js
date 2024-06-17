import { io } from "socket.io-client"; // import connection function

const socket = io('https://grumpy-ghosts-stick.loca.lt/'); // initialize websocket connection

export default socket;