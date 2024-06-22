import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import ClipLoader from 'react-spinners/ClipLoader';

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', theme);
  }, [darkMode]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      // Also remove JWT token
      localStorage.removeItem('access-token');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 text-[#008080] dark:text-white z-10">
      <div className="navbar bg-transparent rounded-md flex flex-col md:flex-row md:justify-between lg:flex-row">
        <div className="navbar-start flex items-center">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </div>
            <div className="menu menu-sm dropdown-content bg-white dark:bg-gray-800 mt-3 z-[1] p-2 shadow rounded-box w-52">
              <ul className="flex flex-col gap-4">
                <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                <li><NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>Community</NavLink></li>
                <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blogs</NavLink></li>
                <li><NavLink to="/about-us" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink></li>
                <li><NavLink to="/contact-us" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink></li>
                {!user && (
                  <>
                    <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="flex items-center ml-2">
            <img className="w-10 h-10 rounded-full border border-[#FFD700]" src="/favicon.webp" alt="Logo" />
            <Link to="/" className="btn btn-ghost text-lg lg:text-lg font-bold">EpicEscapes</Link>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-4">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>Community</NavLink></li>
            <li><NavLink to="/blogs" className={({ isActive }) => isActive ? 'active' : ''}>Blogs</NavLink></li>
            <li><NavLink to="/about-us" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink></li>
            <li><NavLink to="/contact-us" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink></li>
          </ul>
        </div>
        <div className="lg:navbar-end flex gap-4 items-center">
          <label htmlFor="Toggle1" className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800">
            <span className='text-black dark:text-white'>Light</span>
            <span className="relative">
              <input
                id="Toggle1"
                type="checkbox"
                className="hidden peer"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <div className="w-10 h-6 rounded-full shadow-inner bg-gray-300 dark:bg-gray-600 peer-checked:bg-[#008080]"></div>
              <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white dark:bg-gray-100 peer-checked:right-0 peer-checked:left-auto peer-checked:bg-gray-700"></div>
            </span>
            <span className='text-black dark:text-white'>Dark</span>
          </label>

          {user ? (
            <div className="relative">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="avatar online">
                  <img src={user.photoURL || "/user.png"} alt="User" className="rounded-full" style={{ width: '32px', height: '32px' }} />
                </div>
                <div className="dropdown-content menu p-2 shadow bg-white dark:bg-gray-800 rounded-box w-52">
                  <div className="font-bold text-lg">{user.displayName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  {user.role && (
                    <NavLink to={`/${user.role.toLowerCase()}/dashboard`} end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
                  )}
                  <NavLink to='/offer-announcements' className={({ isActive }) => isActive ? 'active' : ''}>Offer Announcements</NavLink>
                  <button onClick={handleSignOut} className="btn btn-ghost flex items-center gap-2">
                    {loading ? <ClipLoader size={15} color={"#123abc"} /> : "Sign Out"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn bg-[#008080] border-0 text-white px-8 py-3 font-semibold rounded-full">Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
