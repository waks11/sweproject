import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

const RateUser = ({ onSubmit, setIsOpen }) => {
    const { user } = useContext(UserContext);
    const [rating, setRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(user.admin) {
            return;
        }
        /* onSubmit should set the chat to archived, and utilizing rating, you should be able to update the users' ratings */   

        const { user_id } = await onSubmit();

        if(user_id === null) {
            return;
        }

        const post_data = {
            user_id: user_id,
            rating: rating
        };
        await axios.post("/api/users/updateRating", post_data, { headers: { 'Content': 'application/json' }});

        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-slate-900 p-20 rounded-lg shadow-lg">
                <h1 className="text-xl text-slate-100 font-semibold mb-4">
                    Rate User
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-slate-100">
                            Please rate the other user in this chat.
                        </label>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <span
                                key={value}
                                className={`cursor-pointer text-3xl ${
                                    value <= rating ? 'text-yellow-500' : 'text-gray-400'
                                }`}
                                onClick={() => setRating(value)}
                            >
                                &#9733;
                            </span>
                        ))}
                        <input type="hidden" name="rating" value={rating} />
                    </div>
                    <div className="flex w-full justify-around">
                        <button 
                            type="submit"
                            className={`bg-stone-900 text-slate-100 py-2 px-4 rounded-full border border-slate-100 ${
                                rating === 0 ? 'bg-gray-800 cursor-not-allowed' : 'hover:bg-blue-600' 
                            }`}
                            disabled={rating === 0}
                        >
                            Submit & Archive
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="bg-stone-900 text-slate-100 py-2 px-6 rounded-full border border-slate-100 hover:bg-blue-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RateUser;