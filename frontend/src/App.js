
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import SignUp from './pages/SignUp';  

function App() {
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
