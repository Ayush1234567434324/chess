import { io } from "socket.io-client"; // import connection function

const socket = io('https://metal-games-clean.loca.lt/'); // initialize websocket connection

export default socket;