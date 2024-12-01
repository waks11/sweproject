import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

export const AdminInfo = () => {

    const navigate = useNavigate();
    const [reportsDisplayed, setReportsDisplayed] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchReportsToDisplayOnStart = async () => {

        const response = await axios.get('/api/reports/getReports?page=1&limit=10');

        const {reports, hasMore} = response.data;
        setReportsDisplayed(reports);
        setHasMore(hasMore);      
    }

    useEffect(() => {
        
        fetchReportsToDisplayOnStart();

    }, []);

    const loadMoreReports = async () => {

        try {

            const { response } = await axios.get(`/api/reports/getReports?page=${page + 1}&limit=10`);

            setReportsDisplayed(previousReports => [...previousReports, response.reports]);
            setPage(previousPage => previousPage + 1);
            setHasMore(response.hasMore);
        } catch (error) {
            console.log("Error loading more reports", error);
        }

    };

    return (
        <div className="flex justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-center mb-6">Admin Reports</h1>
                <InfiniteScroll
                    dataLength={reportsDisplayed.length}
                    next={loadMoreReports}
                    hasMore={hasMore}
                    loader={<h4 className="text-center mt-4">Loading more reports...</h4>}
                >
                    <table className="table-auto w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Reporter</th>
                                <th className="px-4 py-2 text-left">Reported User</th>
                                <th className="px-4 py-2 text-left">Conversation Link</th>
                                <th className="px-4 py-2 text-left">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportsDisplayed.map((report, index) => (
                                <tr
                                    key={index}
                                    className={`border-b hover:bg-gray-100 ${
                                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                >
                                    <td className="px-4 py-2">
                                        <div>
                                            <p className="font-semibold">{report.reporterId.firstName} {report.reporterId.lastName}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div>
                                            <p className="font-semibold">{report.reportedUserId.firstName} {report.reportedUserId.lastName}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => navigate('/messages', { state: { specificConversationId: report.reportedConversationId}})}
                                        >
                                            View Their Conversation
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <p className="text-gray-800">{report.reportedDescription}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </InfiniteScroll>
            </div>
        </div>
    );
};