"use client";
import { useState } from "react";

export default function Home() {
  const [userType, setUserType] = useState("vendor");
  const [formData, setFormData] = useState({
    id: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in attempt:", { userType, ...formData });
    // Handle sign in logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-blue-100">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">SecureRails</h1>
          <p className="text-blue-600">Sign in to your account</p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-blue-900 mb-3">Sign in as:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="vendor"
                checked={userType === "vendor"}
                onChange={(e) => setUserType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-blue-800">Vendor</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="admin"
                checked={userType === "admin"}
                onChange={(e) => setUserType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-blue-800">Admin</span>
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID Field */}
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-blue-900 mb-1">
              ID
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your ID"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Sign In as {userType === "vendor" ? "Vendor" : "Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
