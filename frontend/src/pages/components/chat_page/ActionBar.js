const ActionBar = ({ flagUser, archiveChat, isItemPoster }) => {
    return (
        <div className="flex justify-between items-center bg-gray-100 p-4">
            <button 
                className="text-white rounded-full bg-red-600 p-2.5 hover:bg-red-700 font-medium"
                onClick={flagUser}
            >
                Report
            </button>
            {isItemPoster && 
                <button 
                    className="text-white rounded-full bg-blue-600 p-2.5 hover:bg-blue-700 font-medium"
                    onClick={archiveChat}
                >
                    Archive Chat
                </button>
            }
        </div>
    );
};

export default ActionBar;