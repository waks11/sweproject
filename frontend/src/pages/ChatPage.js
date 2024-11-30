import axios from "axios";
import SideBar from "./components/side_bar/SideBar";
import MessageDisplay from "./components/chat_page/MessageDisplay";
import MessageBar from "./components/chat_page/MessageBar";
import ActionBar from "./components/chat_page/ActionBar";
import RateUser from "./components/rate_user/RateUser";
import ReportUser from "./components/chat_page/ReportUser";
import getSocket from "../utils/socket";
import ChatSideBar from "./components/chat_page/ChatSideBar";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "./components/UserContext";

const ChatPage = () => {

    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [currentConversation, setCurrentConversation] = useState({
        conversationId: null,
        receiverId: null,
        isArchived: null
    });
    const [displayRatingPopup, setDisplayRatingPopup] = useState(false);
    const [reportUserPopup, setReportUserPopup] = useState(false);
    const [isItemPoster, setIsItemPoster] = useState(false);

    const scrollableRef = useRef(null);

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

    useEffect(() => {
        if(scrollableRef.current) {
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSelectConversation = (conversation) => {
        setCurrentConversation({
            conversationId: conversation._id,
            receiverId: (user.id === conversation.users[0]._id) ? conversation.users[1]._id : conversation.users[0]._id,
            isArchived: conversation.isArchived
        });

        setIsItemPoster(user.id === conversation.users[1]._id);
    };

    const handleFlagUser = () => {
        /* flag the user in the conversation that isn't the current user */
        /* should send over the conversation id and reported user id over to the ReportUser.js file */
        /* handleSubmit in the ReportUser.js file should use those ids along with the description and connect to admin's backend */

        console.log('handle flag working');
    };

    const handleArchiveChat = () => {
        /* set chat to archived */
        /* handleSubmit in RateUser.js file will also have the rating stored to be used */

        console.log('handle archive working');
    };



    return(
        <div className="flex h-screen">
            <SideBar />
            <ChatSideBar selectConversation={handleSelectConversation}/>
            <div className="ml-[16rem] w-full h-full overflow-hidden p-6 flex flex-col relative">
                {currentConversation.conversationId ? (
                    <>
                        {!currentConversation.isArchived ? (
                            <div className="absolute top-0 left-4 w-[calc(100%-1rem)]">
                                <ActionBar flagUserPopup={setReportUserPopup} archiveChatPopup={setDisplayRatingPopup} isItemPoster={isItemPoster}/>
                            </div>
                        ) : (
                            <div className="absolute top-0 left-4 w-[calc(100%-1rem)] bg-gray-100 p-6">
                                This chat is archived.
                            </div>
                        )}
                        <div 
                            className="scrollable flex-grow mt-16 overflow-y-auto"
                            ref={scrollableRef}
                        >
                            <MessageDisplay messages={messages} />
                        </div>
                        {!currentConversation.isArchived &&
                            <div className="flex-shrink-0">
                                <MessageBar onSend={handleOnSend} currentConversation={currentConversation}/>
                            </div>
                        }
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
            {displayRatingPopup &&
                <RateUser onSubmit={handleArchiveChat} setIsOpen={setDisplayRatingPopup} />
            }
            {reportUserPopup &&
                <ReportUser onSubmit={handleFlagUser} setIsOpen={setReportUserPopup} />
            }

            <style jsx>{`
                .scrollable::-webkit-scrollbar {
                    display: none;
                }
                .scrollable {
                    scrollbar-width: none;  
                    -ms-overflow-style: none;  
                }
            `}</style>
        </div>
    );
};

export default ChatPage;