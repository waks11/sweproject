import axios from 'axios';
import chatImage from './icons/add_chat.webp';
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";

const PostDisplay = ({ items, loadMore, hasMore }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

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
                        <div className="w-[45vh] h-[45vh] flex items-center justify-center">
                            <img
                                src={item.image_url}
                                alt={'${index}'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-center w-[90%] border border-blue-800 px-4 py-2 space-x-2 rounded-md">
                            <p 
                                className="text-lg max-w-[85%] truncate leading-snug"
                                onClick={(e) => e.currentTarget.classList.toggle('truncate')}
                            >
                                {item.description}
                                <span className="text-blue-500 block">
                                    {"@" + item.location}
                                </span>
                            </p>
                            {user.id === item.user_id && (
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-600"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default PostDisplay;
