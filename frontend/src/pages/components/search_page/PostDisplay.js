import chatImage from './icons/add_chat.webp';
import {useNavigate} from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

const PostDisplay = ({ items, loadMore, hasMore }) => { // 'items' will be the returned list of items that satisfy the query from the database   
    const navigate = useNavigate();

    const handleClick = () => {
        // this should navigate to the messages page while opening a new message depending on the post
        // for now i'm gonna make it a filler to just bring you to the messages page

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

    
    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 ">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center mb-1">
                        <img
                            src={item.image_url}
                            alt={'${index}'}
                            className="w-[80%] h-[80%] object-cover"
                        />
                        <div className="flex justify-between items-center w-[90%] border border-blue-800 px-2 space-x-2 h-12 rounded-md">
                            <p 
                                className="text-lg max-w-[85%] truncate flex items-center"
                                onClick={handleTruncate}
                            >
                                {item.description}
                            </p>
                            <button onClick={handleClick}>
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