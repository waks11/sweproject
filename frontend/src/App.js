
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import SignUp from './pages/SignUp';  
import axios from "axios";
import { useContext } from 'react';
import { UserContext } from './pages/components/UserContext';

function App() {

  const {user} = useContext(UserContext);

  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/signup" element={<SignUp />} /> 
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
