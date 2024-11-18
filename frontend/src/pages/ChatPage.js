import axios from "axios";
import SideBar from "./components/side_bar/SideBar";
import MessageDisplay from "./components/chat_page/MessageDisplay";
import MessageBar from "./components/chat_page/MessageBar";
import { useState, useEffect } from "react";

const messages = [
    { content: "hi", senderId: 0 },
    { content: "bye", senderId: 1 },
    { content: "testing a longer message to see if it wraps or not ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", senderId: 0},
    { content: "testing a longer message to see if it wraps or not ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", senderId: 0},
    { content: "testing a longer message to see if it wraps or not ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", senderId: 0}
];

export const ChatPage = () => {
    return(
        <div className="flex h-screen">
            <SideBar />
            <div className="ml-16 w-full overflow-hidden p-6">
                <MessageDisplay messages={messages} />
                <MessageBar onSend={() => {console.log('hi')}}/>
            </div>
        </div>
    );
};

export default ChatPage;