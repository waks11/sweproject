import React, { useState } from "react";

export const ChatSideBar = ({ conversations }) => {
    const [activeChat, setActiveChat] = useState(null);

    return (
        <div className="fixed top-0 left-20 items-center h-screen w-100 bg-blue-800 text-white">
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
                        onClick={() => setActiveChat(index)}
                    >
                        <p className="font-semibold">
                            {conversation.users.map(user => (user.firstName + ' ' + user.lastName)).join(", ")}
                        </p>
                        <p className="text-sm text-gray-400">
                            {conversation.lastMessage?.content || "No response..."}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatSideBar;