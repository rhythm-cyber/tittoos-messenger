
import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'Prefer not to say',
  });
  const context = useContext(AppContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      context?.login({ 
        name: formData.name.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-8 bg-[#3E1B6B] rounded-2xl shadow-2xl border-2 border-[#764ABC]">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                 <i className="fa-solid fa-user-astronaut text-6xl text-[#FFDE59]"></i>
            </div>
          <h1 className="text-4xl font-bold text-white tracking-wider">Tittoos!</h1>
          <h2 className="text-2xl font-bold text-[#FFDE59]">Messenger</h2>
          <p className="mt-2 text-gray-300">Relive the golden era of chat</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">Screen Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-500 placeholder-gray-400 text-white bg-[#2D1654] focus:outline-none focus:ring-[#FFDE59] focus:border-[#FFDE59] focus:z-10 sm:text-sm"
                placeholder="Enter your screen name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
             <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-500 placeholder-gray-400 text-white bg-[#2D1654] focus:outline-none focus:ring-[#FFDE59] focus:border-[#FFDE59] focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
             <div>
              <label htmlFor="gender" className="sr-only">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-500 text-white bg-[#2D1654] focus:outline-none focus:ring-[#FFDE59] focus:border-[#FFDE59] focus:z-10 sm:text-sm"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-[#3E1B6B] bg-[#FFDE59] hover:bg-[#ffcf2d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#3E1B6B] focus:ring-[#FFDE59] transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>
         <div className="text-center text-xs text-gray-400 mt-4">
            <p>No password needed. Just fill out your profile and dive in!</p>
            <p>This is a frontend simulation.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;