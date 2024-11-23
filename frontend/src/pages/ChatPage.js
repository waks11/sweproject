import axios from "axios";
import SideBar from "./components/side_bar/SideBar";
import MessageDisplay from "./components/chat_page/MessageDisplay";
import MessageBar from "./components/chat_page/MessageBar";
import ChatSideBar from "./components/chat_page/ChatSideBar";
import { useState, useEffect } from "react";

const messages = [
    { content: "hi", senderId: 0 },
    { content: "bye", senderId: 1 },
    { content: "testing a longer message to see if it wraps or not ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", senderId: 0},
    { content: "testing a longer message to see if it wraps or not ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", senderId: 0},
    { content: "testing a longer message to see if it wraps or not ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", senderId: 0}
];

export const ChatPage = () => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {   
        setConversations([
            {
                users: [
                    { firstName: "John", lastName: "Doe", email: "a@ufl.edu", password: "a" },
                    { firstName: "Zedong", lastName: "Mao", email: "b@ufl.edu", password: "b" }
                ],
                lastMessage: "Testing"
            },
            {
                users: [
                    { firstName: "John", lastName: "Doe", email: "a@ufl.edu", password: "a" },
                    { firstName: "Zedong", lastName: "Mao", email: "b@ufl.edu", password: "b" }
                ],
                lastMessage: "Testing"
            }
        ]);
    }, []);

    return(
        <div className="flex h-screen">
            <SideBar />
            <ChatSideBar conversations={conversations}/>

            <div className="ml-16 w-full overflow-hidden p-6">
                <MessageDisplay messages={messages} />
                <MessageBar onSend={() => {console.log('hi')}}/>
            </div>
        </div>
    );
};

export default ChatPage;