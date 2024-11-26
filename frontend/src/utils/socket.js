import { io } from "socket.io-client";

let socket;

const getSocket = () => {

    if (!socket) {
        socket = io('http://localhost:4000', {
            autoConnect: false,
        });
    }
    
    return socket;
}

export default getSocket;