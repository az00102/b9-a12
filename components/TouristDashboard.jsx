import React, { useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import MyProfile from './MyProfile';
import MyBookings from './MyBookings';
import MyWishlist from './MyWishlist';
import RequestToAdmin from './RequestToAdmin';

const TouristDashboard = () => {
  useEffect(() => {
    document.title = "Tourist Dashboard";
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
              to="mybookings"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              My Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="mywishlist"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              My Wishlist
            </NavLink>
          </li>
          <li>
            <NavLink
              to="requesttoadmin"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              Request to Admin
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Tourist Dashboard</h1>
        <Routes>
          <Route path="/" element={<Navigate to="myprofile" />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="mybookings" element={<MyBookings />} />
          <Route path="mywishlist" element={<MyWishlist />} />
          <Route path="requesttoadmin" element={<RequestToAdmin />} />
          <Route path="*" element={<div className="text-center text-red-500">Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default TouristDashboard;
