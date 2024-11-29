import axios from "axios";
import SideBar from "./components/side_bar/SideBar";
import MessageDisplay from "./components/chat_page/MessageDisplay";
import MessageBar from "./components/chat_page/MessageBar";
import ActionBar from "./components/chat_page/ActionBar";
import getSocket from "../utils/socket";
import ChatSideBar from "./components/chat_page/ChatSideBar";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "./components/UserContext";

export const ChatPage = () => {

    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [currentConversation, setCurrentConversation] = useState({
        conversationId: null,
        receiverId: null
    });
    const [displayRatingPopup, setDisplayRatingPopup] = useState(false);
    const [isItemPoster, setIsItemPoster] = useState(false);

    const socketRef = useRef(null);

    const fetchAllMessages = async () => {

        const response = await axios.get(`/api/messages/getMessages?conversationId=${currentConversation.conversationId}`);

        const { curMessages } = response.data;

        setMessages(curMessages);

    }   

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

    useEffect(() => {

        if(currentConversation.conversationId !== null) {
            fetchAllMessages();
        }

    }, [currentConversation])

    const handleOnSend = async ({ conversationId, receiverId, content }) => {

        const newMessage = {
            conversationId: conversationId,
            senderId: user.id,
            receiverId: receiverId,
            content: content
        };

        // const post_data = new FormData();
        // post_data.append("conversationId", conversationId);
        // post_data.append("senderId", user.id);
        // post_data.append("receiverId", receiverId);
        // post_data.append("content", content);

        try {

            await axios.post("/api/messages/sendMessage", newMessage, { headers: { 'Content': 'application/json' }});

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
            conversationId: conversation._id,
            receiverId: (user.id === conversation.users[0]._id) ? conversation.users[1]._id : conversation.users[0]._id
        });

        setIsItemPoster(user.id === conversation.users[1]._id);
    };

    const handleFlagUser = () => {
        /* flag the user in the conversation that isn't the current user */
    }

    const handleArchiveChat = () => {
        /* set the conversation to archived */

        /* do not remove the code below that displays the popup for rating the user */
        setDisplayRatingPopup(true);
    }

    return(
        <div className="flex h-screen">
            <SideBar />
            <ChatSideBar selectConversation={handleSelectConversation}/>
            <div className="ml-[16rem] w-full h-full overflow-hidden p-6 flex flex-col relative">
                {currentConversation.conversationId ? (
                    <>
                        <div className="absolute top-0 left-4 w-[calc(100%-1rem)]">
                            <ActionBar flagUser={handleFlagUser} archiveChat={handleArchiveChat} isItemPoster={isItemPoster}/>
                        </div>
                        <div className="flex-grow mt-16">
                            <MessageDisplay messages={messages} />
                        </div>
                        <div className="flex-shrink-0">
                            <MessageBar onSend={handleOnSend} currentConversation={currentConversation}/>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-center text-gray-800">Chat Page</h1>
                            <p className="text-gray-600 font-medium text-center">Click on a chat to send a message.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;