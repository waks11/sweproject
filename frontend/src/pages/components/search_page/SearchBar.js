import { useState } from 'react';
import plusImage from './icons/plus_sign.webp'
import searchImage from './icons/magnifying_glass.webp'

const SearchBar = ({onSearch}) => { // 'onSearch' is a function that describes what action should occur on submission
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [displayAdvanced, setDisplayAdvanced] = useState(false);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(onSearch) {
            onSearch({description, location});
        }
    };

    const toggleAdvancedDisplay = () => {
        if(displayAdvanced) {
            setLocation('');
        }
        setDisplayAdvanced(!displayAdvanced);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <div className="w-full max-w-lg px-2 bg-white rounded-full shadow-mg border border-blue-800">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Search item..."
                        className="w-full"
                    />
                    <div className="ml-auto flex space-x-2">
                        <button
                            type="button"
                            onClick={toggleAdvancedDisplay}
                            className="flex flex-center justify-center"
                        >
                            <img 
                                src={plusImage} 
                                alt="Plus sign" 
                                className="object-contain w-11 h-11"
                            />
                        </button>
                        <button
                            type="submit"
                        >
                            <img 
                                src={searchImage} 
                                alt="Magnifying glass" 
                                className="object-contain w-12 h-12"
                            />
                        </button>
                    </div>
                </div>
            </div>
            {displayAdvanced && (
                <div className="w-full max-w-lg px-2 bg-white rounded-full shadow-mg border border-blue-800 h-12 flex flex-center px-2">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={location}
                            onChange={handleLocationChange}
                            placeholder="Location..."
                            className="h-8"
                        />
                    </div>
                </div>
            )}
        </form>
    );
};

export default SearchBar;