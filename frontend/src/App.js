
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import SignUp from './pages/SignUp';  
import Login from './pages/Login';
import AccountPage from './pages/AccountPage';
import ChatPage from './pages/ChatPage';
import axios from "axios";
import { useContext } from 'react';
import { UserContext } from './pages/components/UserContext';

import AdminPage from './pages/AdminPage'; // Import the new AdminPage component

function App() {
  const { user, loading } = useContext(UserContext);

  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;

  if (loading) {
    return <div>Loading ...</div>;
  }

  // console.log(user.admin);

  return (
    <div className="App">
      <div className="pages">
        <Routes>
          {!user ? (
            <>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/messages" element={<ChatPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {user.admin ? (
                <Route path="/" element={<Navigate to="/admin" />} />
              ) : (
                <Route path="/" element={<SearchPage />} />
              )}
              <Route path="/admin" element={user.admin ? <AdminPage /> : <Navigate to="/" />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/messages" element={<ChatPage />} />
              <Route path="/signup" element={<Navigate to="/signup" />} />
              <Route path="/login" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
