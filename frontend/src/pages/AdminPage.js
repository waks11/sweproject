import React, { useState, useEffect } from "react";
import SideBar from "./components/side_bar/SideBar";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="flex">
      <SideBar />
      <div className="ml-16 p-6 w-full"> 
        <h1>Admin Dashboard</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Good Standing</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.goodStanding ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => toggleGoodStanding(user._id, user.goodStanding)}
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
  );
};

export default AdminPage;
