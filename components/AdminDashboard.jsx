import React, { useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import MyProfile from './MyProfile';
import AddPackage from './AddPackage';
import ManageUsers from './ManageUsers';

const AdminDashboard = () => {
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen dark:bg-gray-900">
      <nav className="w-full md:w-64 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex-shrink-0">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="myprofile"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="addpackage"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              Add Package
            </NavLink>
          </li>
          <li>
            <NavLink
              to="manageusers"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              Manage Users
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
        <Routes>
          <Route path="/" element={<Navigate to="myprofile" />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="addpackage" element={<AddPackage />} />
          <Route path="manageusers" element={<ManageUsers />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
