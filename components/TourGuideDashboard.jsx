import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import MyProfile from './MyProfile';
import MyAssignedTours from './MyAssignedTours';

const TourGuideDashboard = () => (
  <div className="flex flex-col md:flex-row h-screen dark:bg-gray-900">
    <nav className="w-full md:w-64 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <div className="mt-4 flex flex-col space-y-2">
          <NavLink
            to="myprofile"
            className={({ isActive }) =>
              `p-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
            }
          >
            My Profile
          </NavLink>
          <NavLink
            to="myassignedtours"
            className={({ isActive }) =>
              `p-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
            }
          >
            My Assigned Tours
          </NavLink>
        </div>
      </div>
    </nav>
    <div className="p-4 w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Tour Guide Dashboard</h1>
      <Routes>
        <Route path="/" element={<Navigate to="myprofile" />} />
        <Route path="myprofile" element={<MyProfile />} />
        <Route path="myassignedtours" element={<MyAssignedTours />} />
        <Route path="*" element={<div className="text-center text-red-500">Page not found</div>} />
      </Routes>
    </div>
  </div>
);

export default TourGuideDashboard;
