import { React } from "react";
import { UserContext } from "../UserContext";
import { useContext } from "react";

const Message = ({ message, isUser }) => {
    return(
        <div 
            className={`flex mb-2 ${
                isUser 
                ? "justify-end" 
                : "justify-start"}`}
        >
            <div 
                className={`max-w-[40%] overflow-y-auto break-words px-4 py-2 rounded-lg ${
                    isUser 
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-black"
                }`}
            >
                {message}
            </div>
        </div>
    );
};

const MessageDisplay = ({ messages }) => {
    const { user } = useContext(UserContext);
    
    const participants = [...new Set(messages.flatMap(message => [message.senderId, message.receiverId]))];
    const [user1, user2] = participants;

    return(
        <div className="p-4">
            {messages.map((message, index) => (
                <Message 
                    key={index}
                    message={message.content}
                    isUser={
                        user.admin ? message.senderId === user1 : message.senderId === user.id
                    } 
                />
            ))}
        </div>
    );
};

export default MessageDisplay;