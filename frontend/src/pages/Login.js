import React, { useContext, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import logoImage from './components/side_bar/icons/uf_logo.webp';
import { UserContext } from './components/UserContext';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Checks if user's account info is valid; logs in if yes, does not log in if no
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post('/api/users/login', formData, { withCredentials: true });

      if (response.data.error) {
        toast.error("Login Failed. Please Try Again");
      }
      else {
        toast.success("Logged in Successfully");
        
        setUser(response.data.user);

        navigate('/');

        // window.location.reload();
      }

    } catch (error) {

      console.error("Error Logging In", error);
      toast.error("Login Failed. Please Try Again");
      alert("Login Failed. Please Try Again with Valid Credentials.");

    }

    // On success,
    // <Navigate to="/"/>
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="bg-blue-900 p-16 rounded-lg flex items-center shadow-lg">
        <div className="flex justify-center mx-6">
          <img
            src={logoImage}
            alt="UF Logo"
            className="object-contain rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="mb-4 text-xl text-slate-200 font-bold">
            UFLostAndFound
          </h1>
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-full p-1.5"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="rounded-full p-1.5"
            />
            <button 
              type="submit"
              className="rounded-full bg-slate-900 rounded-full p-1.5 text-slate-100"
            >
              Login
            </button>
            <Link 
              to="/signup"
              className="hover:underline text-slate-200"
            >
              Don't have an account? Click to create one.
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;