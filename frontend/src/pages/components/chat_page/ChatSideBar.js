import axios from "axios";
import { UserContext } from "../UserContext";
import React, { useState, useContext, useEffect } from "react";

export const ChatSideBar = ({ selectConversation }) => {
    const { user } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    const fetchAllConversations = async () => {
        const response = await axios.get(`/api/conversations/getAllConversations?user_id=${user.id}`);
        
        const { curConversations } = response.data;
        
        setConversations(curConversations);
    }

    useEffect(() => {

        fetchAllConversations();

    }, []);

    return (
        <div className="fixed top-0 left-20 items-center h-screen w-[12rem] bg-blue-800 text-white">
            <div className="p-4 text-xl font-bold border-b border-gray-700">
                Chats
            </div>
            <ul className="flex-1 overflow-y-auto">
                {conversations.map((conversation, index) => (   
                    <li
                        key={conversation._id}
                        className={`p-3 cursor-pointer hover:bg-gray-700 ${
                            activeChat === index ? "bg-gray-700" : ""
                        }`}
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