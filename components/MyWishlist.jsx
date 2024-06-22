// src/components/MyWishlist.jsx
import React, { useState, useEffect, useContext } from 'react';
import useAxiosSecure from '../components/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyWishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user && user.email) {
      fetchWishlist(user.email);
    }
  }, [user]);

  const fetchWishlist = async (email) => {
    try {
      const response = await axiosSecure.get(`/api/wishlist/${email}`);
      const packageIds = response.data.map(item => item.packageId);
      
      if (packageIds.length === 0) {
        setLoading(false);
        setError('No items in your wishlist.');
        return;
      }
      
      fetchPackages(packageIds);
    } catch (err) {
      setError('Failed to fetch wishlist data.');
      setLoading(false);
    }
  };

  const fetchPackages = async (packageIds) => {
    try {
      const response = await axiosSecure.post('/api/packages/byIds', { packageIds });
      setPackages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch packages data.');
      setLoading(false);
    }
  };

  const handleDelete = async (packageId) => {
    try {
      await axiosSecure.delete('/api/wishlist', {
        data: { email: user.email, packageId }
      });
      setWishlist(wishlist.filter(item => item.packageId !== packageId));
      setPackages(packages.filter(pkg => pkg._id !== packageId));
    } catch (err) {
      setError('Failed to delete wishlist item.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPackages = packages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(packages.length / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4 text-center">My Wishlist</h2>
      <div className="overflow-x-auto">
        <div className="min-w-full max-w-screen-lg mx-auto">
          <table className="min-w-full bg-white dark:bg-gray-700 border dark:border-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-600 text-center">Package Name</th>
                <th className="py-2 px-4 border-b dark:border-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPackages.map(pkg => (
                <tr key={pkg._id} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-2 px-4 border-b dark:border-gray-600 text-center">{pkg.packageName}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600 text-center">
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-500 mr-2"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <Link to={`/package/${pkg._id}`} className="bg-[#008080] text-white px-4 py-2 rounded mt-4 inline-block">View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-black dark:text-white'} rounded`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWishlist;
