// src/pages/SignUp.js
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import logoImage from './components/side_bar/icons/uf_logo.webp';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData);
      console.log(response.data); // Handle success (e.g., redirect, show message)
    } catch (error) {
      console.error('Error signing up:', error.response?.data);
    }

    // On success, perform
    // <Navigate to="/login"/>
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
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="rounded-full p-1.5"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="rounded-full p-1.5"
            />
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
              Sign Up
            </button>
            <Link 
              to="/login"
              className="hover:underline text-slate-200"
            >
              Already have an account? Click to login.
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
