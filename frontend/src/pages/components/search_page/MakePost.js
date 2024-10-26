import {useState, useContext} from 'react';
import { UserContext } from '../UserContext';
import imageImage from './icons/add_image.webp';

const MakePost = ({onPost}) => {
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // setUserID() - need to set userID with the logged user

        console.log(user);

        if(onPost) {
            await onPost({userID: user.id, image, description, location});
        }

        setIsOpen(false);
        setImage(null);
        setDescription('');
        setLocation('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-blue-800 rounded-full p-[3%] max-p-8 shadow-lg"
            >
                <img
                    src={imageImage}
                    alt="Add image image"
                    className="size-12"
                />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="bg-slate-900 p-20 rounded-lg shadow-lg">
                        <h1 className="text-xl text-slate-100 font-semibold mb-4">
                            Upload Found Item
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1 text-slate-100">
                                    Image:
                                </label>
                                <input
                                    type="file"
                                    onChange={handleImageChange} 
                                    required
                                    className="text-slate-100"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 text-slate-100">
                                    Description:
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required 
                                    className="w-full border p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 text-slate-100">
                                    Location:
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full border p-2"
                                />
                            </div>
                            <div className="flex w-full justify-around">
                                <button 
                                    type="submit"
                                    className="bg-stone-900 text-slate-100 py-2 px-4 rounded-full border border-slate-100"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-stone-900 text-slate-100 py-2 px-6 rounded-full border border-slate-100"
                                >
                                    Exit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MakePost;