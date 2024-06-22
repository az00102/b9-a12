import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../components/useAxiosSecure';
import { ThreeDots } from 'react-loader-spinner';

const MyAssignedTours = () => {
  const { user } = useContext(AuthContext);
  const [assignedTours, setAssignedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchAssignedTours = async () => {
      try {
        const response = await axiosSecure.get(`/api/assigned-tours?guide=${user.displayName}`);
        const tourData = await Promise.all(response.data.map(async (tour) => {
          const packageResponse = await axiosSecure.get(`/api/packages/${tour.packageId}`);
          return {
            ...tour,
            packageName: packageResponse.data.packageName,
            price: packageResponse.data.price,
            touristEmail: tour.email,
          };
        }));
        setAssignedTours(tourData);
      } catch (error) {
        console.error('Error fetching assigned tours:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.displayName) {
      fetchAssignedTours();
    }
  }, [user, axiosSecure]);

  const handleAccept = async (bookingId) => {
    try {
      await axiosSecure.patch(`/api/bookings/${bookingId}/status`, { status: 'Accepted' });
      setAssignedTours(assignedTours.map(tour => tour._id === bookingId ? { ...tour, status: 'Accepted' } : tour));
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axiosSecure.patch(`/api/bookings/${bookingId}/status`, { status: 'Rejected' });
      setAssignedTours(assignedTours.filter(tour => tour._id !== bookingId));
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  // Pagination logic
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = assignedTours.slice(indexOfFirstTour, indexOfLastTour);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#008080" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">My Assigned Tours</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-2 px-4 border dark:border-gray-600">Package Name</th>
              <th className="py-2 px-4 border dark:border-gray-600">Tourist Email</th>
              <th className="py-2 px-4 border dark:border-gray-600">Tour Date</th>
              <th className="py-2 px-4 border dark:border-gray-600">Tour Price</th>
              <th className="py-2 px-4 border dark:border-gray-600">Status</th>
              <th className="py-2 px-4 border dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTours.map(tour => (
              <tr key={tour._id} className="text-center">
                <td className="py-2 px-4 border dark:border-gray-600">{tour.packageName}</td>
                <td className="py-2 px-4 border dark:border-gray-600">{tour.touristEmail}</td>
                <td className="py-2 px-4 border dark:border-gray-600">{new Date(tour.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border dark:border-gray-600">{tour.price}</td>
                <td className="py-2 px-4 border dark:border-gray-600">{tour.status}</td>
                <td className="py-2 px-4 border dark:border-gray-600">
                  {tour.status === 'In Review' && (
                    <>
                      <button
                        onClick={() => handleAccept(tour._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(tour._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(assignedTours.length / toursPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button
                  onClick={() => paginate(i + 1)}
                  className="page-link bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-3 py-1 rounded"
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MyAssignedTours;
