import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

const ReportUser = ({ onSubmit, setIsOpen }) => {
    const { user } = useContext(UserContext);
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(user.admin) {
            return;
        }

        /* utilize the reported user id and conversation id given from onSubmit along with description to send to admin backend */
        const {conversationId, reporterId, reportedUserId, isArchived} = onSubmit();

        if(isArchived) {
            return;
        }

        const newReportInformation = {
            reporterId,
            reportedUserId,
            reportedConversationId: conversationId,
            reportedDescription: description
        };

        await axios.post("/api/reports/createReport", newReportInformation, { headers: { 'Content': 'application/json' }});

        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-slate-900 p-20 rounded-lg shadow-lg">
                <h1 className="text-xl text-slate-100 font-semibold mb-4">
                    Report User
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-slate-100">
                            Please explain your reasoning for reporting this user.
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required 
                            className="w-full border p-2"
                        />
                    </div>
                    <div className="flex w-full justify-around">
                        <button 
                            type="submit"
                            className="bg-stone-900 text-slate-100 py-2 px-4 rounded-full border border-slate-100 hover:bg-blue-600"
                        >
                            Submit
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

export default ReportUser;