import axios from "axios";
import { UserContext } from "../UserContext";
import { useLocation } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";

export const ChatSideBar = ({ selectConversation, specificConversationId = null }) => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    const fetchAllConversations = async () => {
        const response = await axios.get(`/api/conversations/getAllConversations?user_id=${user.id}`);
        
        const { curConversations } = response.data;
        
        setConversations(curConversations);

        if(specificConversationId && user?.admin === false) {
           
            const specificIndex = curConversations.findIndex((conversation) => conversation._id === specificConversationId);

            if(specificIndex !== -1) {
                setActiveChat(specificIndex);
                setConversations(curConversations[specificIndex]);
            }
        }
        else if(specificConversationId && user.admin === true) {

            const response = await axios.get(`/api/conversations/getConversationById?id=${specificConversationId}`);
            
            const specificConversation = [response.data];

            setConversations(specificConversation);
            setActiveChat(0);
            
        }
    }

    useEffect(() => {

        specificConversationId = location.state?.specificConversationId;
        fetchAllConversations();

    }, []);

    return (
        <div className="fixed top-0 left-20 items-center h-screen w-[12rem] bg-blue-800 text-white">
            <div className="p-4 text-xl font-bold border-b border-gray-700">
                Chats
            </div>
            <ul className="scrollable flex-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
                {conversations.map((conversation, index) => (   
                    <li
                        key={conversation._id}
                        className={`p-3 cursor-pointer hover:bg-gray-700 
                            ${activeChat === index ? "bg-gray-700" : (
                                conversation.isArchived ? "bg-gray-900" : ""
                            )}
                        `}
                        onClick={() => {
                            setActiveChat(index);
                            selectConversation(conversation);
                        }}
                    >
                        <p className="font-semibold">
                            {conversation.users.filter((curUser) => curUser._id !== user.id)
                                                .map((curUser) => `${curUser.firstName} ${curUser.lastName}`)
                                                .join(", ")}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-2">
                            {conversation.lastMessage?.content || "No response..."}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatSideBar;