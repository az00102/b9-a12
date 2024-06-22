// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Root from './components/Root';
import Error from './components/Error';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';
import PackageDetailsPage from './components/PackageDetailsPage';
import MyProfile from './components/MyProfile';
import AddPackage from './components/AddPackage';
import ManageUsers from './components/ManageUsers';
import TouristDashboard from './components/TouristDashboard';
import TourGuideDashboard from './components/TourGuideDashboard';
import AdminDashboard from './components/AdminDashboard';
import TourGuideProfile from './components/TourGuideProfile';
import TourTypePackages from './components/TourTypePackages';
import StoryDetail from './components/StoryDetail';
import AllStories from './components/AllStories';
import TouristStories from './components/TouristStories';
import MyBookings from './components/MyBookings';
import Payment from './components/Payment';
import Community from './components/Community';
import Blog from './components/Blog';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import AllPackages from './components/AllPackages';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="package/:id" element={<PackageDetailsPage />} />
        <Route path="guide/:id" element={<TourGuideProfile />} />
        <Route path="tours/:type" element={<TourTypePackages />} />
        <Route path="story/:id" element={<StoryDetail />} />
        <Route path="all-stories" element={<AllStories />} />
        <Route path="all-packages" element={<AllPackages />} />
        <Route path="community" element={<Community />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="blogs" element={<Blog />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="tourist-stories" element={<TouristStories />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="admin/dashboard/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}>
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="addpackage" element={<AddPackage />} />
          <Route path="manageusers" element={<ManageUsers />} />
        </Route>
        <Route path="tourist/dashboard/*" element={<ProtectedRoute roles={['tourist']}><TouristDashboard /></ProtectedRoute>} />
        <Route path="tourguide/dashboard/*" element={<ProtectedRoute roles={['tourguide']}><TourGuideDashboard /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  </Router>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
