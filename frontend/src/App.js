
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import SignUp from './pages/SignUp';  
import Login from './pages/Login'
import axios from "axios";
import { useContext } from 'react';
import { UserContext } from './pages/components/UserContext';

function App() {

  const {user} = useContext(UserContext);

  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;

  console.log(user);

  return (
    <div className="App">
        <div className="pages">
          <Routes>

            {!user ? (
              <>
                <Route path="/signup" element={<SignUp />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />}/>
              </>
            ) : (
              <>
                <Route path="/" element={<SearchPage />}/>
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
