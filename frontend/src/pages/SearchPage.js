import SideBar from './components/side_bar/SideBar'
import SearchBar from './components/search_page/SearchBar';
import PostDisplay from './components/search_page/PostDisplay';
import MakePost from './components/search_page/MakePost';

export const SearchPage = () => {
    let itemsDisplayed = [];

    const handleSearch = ({description, location}) => { 
        // the onSearch parameter for SearchBar that should run a semantic search and return a list of posts to display
        // this lists of posts will be sent to the items parameter of PostDisplay to be displayed 
        console.log(description, location);
    };

    const handleMakePost = ({userID, image, description, location}) => {
        // onSearch parameter for MakePost that should create a post based off the given info
        console.log(userID, image, description, location);
        itemsDisplayed.push({
            user_id: userID,
            image_url: image,
            description: description,
            location: location
        })
    };

    return (
        <div className="flex">
            <SideBar />
            <div className="ml-16 p-6 w-full">
                <SearchBar onSearch={handleSearch} />

                {/* items should initially be all items in the database */}
                <PostDisplay items={itemsDisplayed} />

                <MakePost onPost={handleMakePost} />
            </div>
        </div>
    );
};

export default SearchPage;