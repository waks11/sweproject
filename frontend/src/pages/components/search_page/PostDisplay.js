import axios from 'axios';
import chatImage from './icons/add_chat.webp';
import deleteIcon from './icons/remove.png';
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";

const PostDisplay = ({ items, loadMore, hasMore }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleClick = async (item) => {
        // If it is their own item, they are not allowed to start a conversation with themselves
        if(user.id === item.user_id) {
            console.error("Cannot Reply to Your Own Item");
            return;
        }

        // Check if Conversation Between Them Already Exists
        const response = axios.get(`/api/conversations/getConversationExists?senderId=${user.id}&receiverId=${item.user_id}`)

        if (response === true) {
            navigate('/messages');
            return;
        }

        // Create Convseration By Calling Backend Function
        const post_data = {
            senderId: user.id,
            receiverId: item.user_id,
            item_id: item._id
        };

        await axios.post("/api/conversations/createChannel", post_data, { headers: { 'Content': 'application/json' }});

        navigate('/messages');
    };

    const handleTruncate = (e) => {
        e.currentTarget.classList.toggle('truncate');
    };

    if(!items || items.length === 0) {

        return (
            <div className="flex items-center justify-center">
                <p className="text-xxl text-center p-6">
                    Search found no matches (try again with broader search terms).
                </p>
            </div>
        );
    }
    
    const handleDelete = async (postId) => {
        try {
            const response = await axios.delete(`/api/lostItems/delete/${postId}?user_id=${user.id}`, {
                headers: { 'Content-Type': 'application/json' },
            });            
    
            if (response.status === 200) {
                alert("Post deleted successfully");
                window.location.reload(); // Reload or refresh items
            }
        } catch (error) {
            console.error("Error deleting post:", error.response?.data || error.message);
        }
    };
    

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 ">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center mb-1">
                        <div className="relative w-[45vh] h-[45vh] flex items-center justify-center">
                            <img
                                src={item.image_url}
                                alt={'${index}'}
                                className="w-full h-full object-cover"
                            />
                            {user.id === item.user_id && (
                                <button
                                    onClick={() => handleDelete(item._id)}
                                >
                                    <img 
                                        src={deleteIcon}
                                        alt="Delete Icon"
                                        className="absolute top-2 right-2 w-8 h-9"
                                    />
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-center w-[90%] border border-blue-800 px-4 py-2 space-x-2 rounded-md">
                            <p 
                                className="text-lg max-w-[85%] truncate leading-snug"
                                onClick={handleTruncate}
                            >
                                {item.description}
                                <span className="text-blue-500 block">
                                    {"@" + item.location}
                                </span>
                            </p>
                            <button onClick={() => handleClick(item)}>
                                <img 
                                    src={chatImage}
                                    alt="Add chat image"
                                    className="w-8 h-9 object-contain"
                                />
                            </button>
                            
                        </div>
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default PostDisplay;
