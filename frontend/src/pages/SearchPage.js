import SideBar from './components/side_bar/SideBar'
import SearchBar from './components/search_page/SearchBar';
import PostDisplay from './components/search_page/PostDisplay';
import MakePost from './components/search_page/MakePost';
import axios from "axios";
import getSocket from "../utils/socket";
import { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from './components/UserContext';
import RateUser from './components/rate_user/RateUser';

export const SearchPage = () => {
    const { user } = useContext(UserContext);
    const [itemsDisplayed, setItemsDisplayed] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [ratingRequests, setRatingRequests] = useState([]);
    const [currentRatingRequest, setCurrentRatingRequest] = useState(null);

    const socketRef = useRef(null);

    const fetchItemsToDisplayOnStart = async () => {

        const response = await axios.get(`/api/lostItems/getPage?page=1&limit=24`);

        const { items, has_more } = response.data; 

        setItemsDisplayed(items);

        setHasMore(has_more);
    }

    useEffect(() => {

        fetchItemsToDisplayOnStart();

        const socket = getSocket();
        socket.connect();
        socketRef.current = socket;

        socket.emit('userOnline', { userId: user.id, conversationId: null });

        socket.on('rateUser', (data) => {
            setRatingRequests((prevData) => [...prevData, data]);
            
            if(!currentRatingRequest) {
                setCurrentRatingRequest(data);
            }
        });

        return () => {
            socket.disconnect();
        }

    }, []); 

    const loadMoreData = async () => {
        
        try {

            const { response } = await axios.get(`/api/lostItems/getPage?page=${page + 1}&limit=24`);

            setItemsDisplayed(previousItems => [ ...previousItems, ...response.items]);

            setPage(previousPage => previousPage + 1);

            setHasMore(response.hasMore);

        } catch (error) {

            console.log("Error Loading More Items: ", error);

        }

    };

    const handleSearch = async ({description, location}) => { 
        // the onSearch parameter for SearchBar that should run a semantic search and return a list of posts to display
        // this lists of posts will be sent to the items parameter of PostDisplay to be displayed 

        if (!description || (description == "" && location == "")) {
            fetchItemsToDisplayOnStart();
            return;
        }

        try {

            const response = await axios.get(`/api/lostItems/search/semantic?user_search=${description}`);
            
            setItemsDisplayed(response.data.items);

            setHasMore(false);


        } catch (error) {

            console.log("Error in Semantic Search: ", error);

        }

    };

    const handleMakePost = async ({userID, image, description, location}) => {
        // onSearch parameter for MakePost that should create a post based off the given info

        const post_data = new FormData(); 
        post_data.append("user_id", userID);
        post_data.append("lostImage", image);
        post_data.append("description", description);
        post_data.append("location", location);

        try {

            const { item } = await axios.post("/api/lostItems/upload", post_data, { headers: { 'Content': 'multipart/form-data' }});
            
            const imageUrl = item.image_url;
            
            setItemsDisplayed(previousItems => [
                {
                    user_id: userID,
                    image_url: imageUrl,
                    description: description,
                    location: location
                },
                ...previousItems
            ]);

        } catch(error) {

            console.error("Error Uploading Post: ", error);
            
        }

        // console.log(userID, image, description, location);

        // itemsDisplayed.push({
        //     user_id: userID,
        //     image_url: image,
        //     description: description,
        //     location: location
        // })
    };

    const handleRateUserSubmit = async () => {

        if(!currentRatingRequest) return null;
        
        const raterId = currentRatingRequest.raterId;
        setRatingRequests((prevRequests) => prevRequests.slice(1));

        if(ratingRequests.length > 1) {
            setCurrentRatingRequest(ratingRequests[1]);
        }
        else {
            setCurrentRatingRequest(null);
        }
        
        return { user_id: raterId};
    }

    const closeRateUserPopup = () => {

        setRatingRequests((prevRequests) => prevRequests.slice(1));
        if(ratingRequests.length > 1) {
            setCurrentRatingRequest(ratingRequests[1]);
        }
        else {
            setCurrentRatingRequest(null);
        }

    }

    return (
        <div className="flex">
            <SideBar />
            <div className="ml-16 p-6 w-full">
                <SearchBar onSearch={handleSearch} />

                {/* items should initially be all items in the database */}
                <PostDisplay items={itemsDisplayed} loadMore={loadMoreData} hasMore={hasMore}/>

                <MakePost onPost={handleMakePost} />
            </div>

            {currentRatingRequest && (
                <RateUser onSubmit={handleRateUserSubmit} setIsOpen={closeRateUserPopup}/>
            )}

        </div>
    );
};

export default SearchPage;