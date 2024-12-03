import React, { useState, useEffect } from "react";
import SideBar from "./components/side_bar/SideBar";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Display the admin dashboard to the admin page, and finding all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/dashboard");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  // Update the goodStanding value when Admin clicks on button
  const toggleGoodStanding = async (id, currentStatus) => {
    try {
      const response = await axios.put(`/api/admin/update-good-standing/${id}`, {
        goodStanding: !currentStatus,
      });

      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, goodStanding: response.data.goodStanding } : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="ml-16 p-8 w-full">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <table className="w-full border-collapse border border-gray-200 text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                <th className="px-4 py-2 border border-gray-300">Good Standing</th>
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  <td className="px-4 py-2 border border-gray-300">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {user.goodStanding ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() =>
                        toggleGoodStanding(user._id, user.goodStanding)
                      }
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        user.goodStanding
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                    >
                      {user.goodStanding ? "Set to Bad" : "Set to Good"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  

  // return (
  //   <div className="flex">
  //     <SideBar />
  //     <div className="ml-16 p-6 w-full"> 
  //       <h1>Admin Dashboard</h1>
  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Name</th>
  //             <th>Email</th>
  //             <th>Good Standing</th>
  //             <th>Action</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {users.map((user) => (
  //             <tr key={user._id}>
  //               <td>{user.firstName} {user.lastName}</td>
  //               <td>{user.email}</td>
  //               <td>{user.goodStanding ? "Yes" : "No"}</td>
  //               <td>
  //                 <button
  //                   onClick={() => toggleGoodStanding(user._id, user.goodStanding)}
  //                 >
  //                   {user.goodStanding ? "Set to Bad" : "Set to Good"}
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div> 
  //   </div>
  // );
};

export default AdminPage;
