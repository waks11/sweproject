import axios from "axios";
import SideBar from "./components/side_bar/SideBar";
import MessageDisplay from "./components/chat_page/MessageDisplay";
import MessageBar from "./components/chat_page/MessageBar";
import getSocket from "../utils/socket";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "./components/UserContext";

export const ChatPage = () => {

    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [currentConversation, setCurrentConversation] = useState({
        conversationId: null,
        receiverId: null
    });

    const socketRef = useRef(null);

    useEffect(() => {
        const socket = getSocket();
        socket.connect();
        socketRef.current = socket;

        socket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('typing');
            socket.off('messageRead');
            socket.off('unreadMessages');

            socket.disconnect();
        };

    }, []);

    const handleOnSend = async ({ conversationId, receiverId, content }) => {

        const newMessage = {
            conversationId: conversationId,
            senderId: user.id,
            receiverId: receiverId,
            content: content
        };

        const post_data = new FormData();
        post_data.append("conversationId", conversationId);
        post_data.append("senderId", user.id);
        post_data.append("receiverId", receiverId);
        post_data.append("content", content);

        try {

            await axios.post("/api/messages/sendMessage", post_data, { headers: { 'Content': 'multipart/form-data' }});

            if (socketRef.current) {
                socketRef.current.emit('sendMessage', newMessage);
            }
            
            setMessages(previousMessages => [...previousMessages, newMessage]);

        } catch (error) {
            console.error("Error Sending Message", error);
        }

    };

    const handleSelectConversation = (conversation) => {
        setCurrentConversation({
            conversationId: conversation.id,
            receiverId: conversation.receiverId
        });
    };

    return(
        <div className="flex h-screen">
            <SideBar />
            <ChatSideBar conversations={conversations}/>
            <div className="ml-[16rem] w-full h-full overflow-hidden p-6 flex flex-col">
                <div className="flex-grow">
                    <MessageDisplay messages={messages} />
                </div>
                <div className="flex-shrink-0">
                    <MessageBar onSend={handleOnSend} currentConversation={currentConversation}/>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;