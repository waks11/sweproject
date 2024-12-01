import { Server } from "socket.io";
import socketHandlers from "./controllers/socketHandler.js";

const socketHandler = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log("User Connected:", socket.id);
        socketHandlers(io, socket);
    });

    return io;
};

export default socketHandler;