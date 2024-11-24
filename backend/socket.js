import { Server } from "socket.io";
import socketHandlers from "./controllers/socketHandler.js";

const socketHandler = (server) => {

    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log("User Connected:", socket.id);
        socketHandlers(io, socket);
    });

    return io;
};

export default socketHandler;