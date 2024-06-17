import { io } from "socket.io-client"; // import connection function

const socket = io('192.168.1.103:8080'); // initialize websocket connection

export default socket;