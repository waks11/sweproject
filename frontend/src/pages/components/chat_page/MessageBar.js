import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import sendMessageImage from "./icons/send_message.webp";

const MessageBar = ({onSend, currentConversation}) => {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");

    const handleSetMessage = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = (e) => {
        e.preventDefault();

        const { conversationId, receiverId } = currentConversation;

        if (!conversationId || !receiverId) {
            console.error("Conversation or reciever not set");
            return;
        }

        onSend({
            conversationId,
            receiverId,
            content: message
        });

        setMessage("");
    }; 

    if(currentConversation.isArchived) {
        return null;
    }

    if(!user.admin) {
        return(
            <div className="w-full px-2 bg-white rounded-full shadow-mg border border-blue-800">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={message}
                        onChange={handleSetMessage}
                        onKeyDown={(e) => {
                        if(e.key === 'Enter' && message !== "") {
                            sendMessage(e);
                        }
                    }}
                    placeholder="Type message..."
                        className="w-full"
                    />
                    <button
                        type="submit"
                        onClick={sendMessage}
                    >
                        <img 
                            src={sendMessageImage} 
                            alt="Airplane" 
                            className="object-contain w-12 h-12"
                        />
                    </button>
                </div>
            </div>
        );
    }
};

export default MessageBar;