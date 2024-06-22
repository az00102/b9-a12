import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../components/useAxiosSecure';
import { ThreeDots } from 'react-loader-spinner';
import CheckoutForm from './CheckoutForm'; // Import CheckoutForm
import Modal from 'react-modal'; // Import Modal
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Confetti from 'react-confetti';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [discountApplicable, setDiscountApplicable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosSecure.get(`/api/bookings?email=${user.email}`);
        const bookingData = await Promise.all(response.data.map(async (booking) => {
          const packageResponse = await axiosSecure.get(`/api/packages/${booking.packageId}`);
          return {
            ...booking,
            packageName: packageResponse.data.packageName,
            guide: packageResponse.data.guide,
            price: packageResponse.data.price,
            status: booking.status,
          };
        }));
        setBookings(bookingData);

        if (bookingData.length >= 3) {
          setShowConfetti(true);
          setDiscountApplicable(true);

          // Stop the confetti animation after 5 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchBookings();
    }
  }, [user, axiosSecure]);

  const handleCancel = async (bookingId) => {
    try {
      await axiosSecure.delete(`/api/bookings/${bookingId}`);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalIsOpen(false);
  };

  const calculateDiscountedPrice = (price) => {
    return (price * 0.9).toFixed(2);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

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
      <h2 className="text-2xl font-bold mb-4 text-center">My Bookings</h2>
      {showConfetti && (
        <div className="flex justify-center items-center mb-4">
          <Confetti />
          <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Congratulations!</h3>
            <p>You have booked more than 3 times! Enjoy a 10% discount on your next booking.</p>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-2 px-4 border dark:border-gray-600">Package Name</th>
              <th className="py-2 px-4 border dark:border-gray-600">Tour Guide Name</th>
              <th className="py-2 px-4 border dark:border-gray-600">Tour Date</th>
              <th className="py-2 px-4 border dark:border-gray-600">Tour Price</th>
              <th className="py-2 px-4 border dark:border-gray-600">Status</th>
              <th className="py-2 px-4 border dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr key={booking._id} className="text-center">
                <td className="py-2 px-4 border dark:border-gray-600">{booking.packageName}</td>
                <td className="py-2 px-4 border dark:border-gray-600">{booking.guide}</td>
                <td className="py-2 px-4 border dark:border-gray-600">{new Date(booking.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border dark:border-gray-600">
                  {discountApplicable && bookings.indexOf(booking) === 3
                    ? `${calculateDiscountedPrice(booking.price)} (10% Off)`
                    : booking.price}
                </td>
                <td className="py-2 px-4 border dark:border-gray-600">{booking.status}</td>
                <td className="py-2 px-4 border dark:border-gray-600">
                  {booking.status === 'In Review' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status === 'Accepted' && (
                    <button
                      onClick={() => openModal(booking)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Pay {discountApplicable && bookings.indexOf(booking) === 3 && '(10% Discount)'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(bookings.length / bookingsPerPage) }, (_, i) => (
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

      {/* Modal for Payment */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Payment Modal"
        className="flex justify-center items-center h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg mx-4">
          <h2 className="text-xl font-bold mb-4">Confirm your Booking</h2>
          {selectedBooking && (
            <Elements stripe={stripePromise}>
              <CheckoutForm booking={selectedBooking} discountApplied={discountApplicable && bookings.indexOf(selectedBooking) === 3} /> {/* Pass the selected booking */}
            </Elements>
          )}
          <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
