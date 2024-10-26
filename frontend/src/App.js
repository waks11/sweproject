
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import SignUp from './pages/SignUp';  
import Login from './pages/Login';
import axios from 'axios';

function App() {
  axios.defaults.baseURL = 'http://localhost:4000/';
  axios.defaults.withCredentials = true;

  const [isLoggedIn, setIsLoggedIn] = useState(true); // set the initial state to false

  useEffect(() => {
    setIsLoggedIn(true);
    // this should set isLoggedIn based on if the user is logged in or not
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={ isLoggedIn ? <SearchPage /> : <Navigate to="/login"/> }
            />
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
