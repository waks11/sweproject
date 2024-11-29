export const AccountInfo = ( {userInfo} ) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Account Information
                </h1>
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-600 font-medium">Name: </p>
                        <p className="text-gray-900">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Email: </p>
                        <p className="text-gray-900">{userInfo.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">Suspicion Status: </p>
                        <p
                            className={`font-semibold ${
                                userInfo.goodStanding ? "text-green-500" : "text-red-500"
                            }`}
                        >
                            {userInfo.goodStanding ? "All Clear" : "Flagged"}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">User Rating: </p>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${(userInfo.score / 5) * 100}%`}}
                            >
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{userInfo.score} / 5</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;