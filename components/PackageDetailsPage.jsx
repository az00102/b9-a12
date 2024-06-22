// src/components/PackageDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ThreeDots } from 'react-loader-spinner';
import useAxiosSecure from '../components/useAxiosSecure';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PackageDetailsPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [packageDetails, setPackageDetails] = useState(null);
  const [tourGuides, setTourGuides] = useState([]);
  const [openDay, setOpenDay] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = '/login';
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axiosSecure.get(`/api/packages/${id}`);
        setPackageDetails(response.data);
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    const fetchTourGuides = async () => {
      try {
        const response = await axiosSecure.get('/api/guides');
        setTourGuides(response.data);
      } catch (error) {
        console.error('Error fetching tour guides:', error);
      }
    };

    fetchPackageDetails();
    fetchTourGuides();
  }, [id, axiosSecure]);

  const toggleDay = (index) => {
    setOpenDay(openDay === index ? null : index);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post('/api/bookings', {
        packageId: id,
        email: user.email,
        startDate,
        guide: e.target.guide.value
      });
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error booking package:', error);
    }
  };

  if (!packageDetails || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#008080" height={80} width={80} />
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="container mx-auto p-4">
        {/* Gallery Section */}
        <section className="body-font bg-white dark:bg-gray-800 text-black dark:text-white">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4">Explore Exotic Destinations</h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Embark on a Journey of Cultural Richness and Natural Beauty, Uncovering the Charm and Authenticity of Diverse Landscapes and Traditions Across the Globe.</p>
            </div>
            <div className="flex flex-wrap -m-4">
              {packageDetails.images.map((image, index) => (
                <div key={index} className="lg:w-1/3 sm:w-1/2 p-4 flex">
                  <div className="w-full">
                    <div className="flex flex-col w-full h-full">
                      <div className="flex relative h-full">
                        <img
                          alt="gallery"
                          className="w-full h-64 object-cover object-center"
                          src={`data:image/jpeg;base64,${image}`}
                        />
                        <div className="absolute top-0 left-0 m-4 bg-white dark:bg-gray-700 px-2 py-1 rounded-md">
                          <span className="text-[#6CBF40] text-base font-bold">Destination {index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About The Tour Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About The Tour</h2>
          <p>{packageDetails.about}</p>
        </section>

        {/* Tour Plan Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tour Plan</h2>
          <div className="space-y-4">
            {packageDetails.tourPlan.map((plan, index) => (
              <div key={index} className="border rounded-lg shadow-lg">
                <button
                  onClick={() => toggleDay(index)}
                  className="w-full text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-t-lg flex justify-between items-center"
                >
                  <span className="font-bold">Day {index + 1}</span>
                  <span>{openDay === index ? '-' : '+'}</span>
                </button>
                {openDay === index && (
                  <div className="p-4 bg-white dark:bg-gray-700 rounded-b-lg">
                    <p>{plan.info}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tour Guides Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tour Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tourGuides.map((guide) => (
              <div key={guide._id} className="p-4 border rounded-lg shadow-lg">
                <img src={guide.photoURL} alt={guide.name} className="rounded-full w-20 h-20 mb-4" />
                <h3 className="text-lg font-bold">{guide.name}</h3>
                <Link
                  to={`/guide/${guide._id}`}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Book This Tour</h2>
          {user && (
            <form className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg" onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-300">Package Name</label>
                <input
                  type="text"
                  value={packageDetails.packageName}
                  readOnly
                  className="mt-1 p-2 w-full border border-[#FFD700] rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-300">Tourist Name</label>
                <input
                  type="text"
                  value={user.displayName}
                  readOnly
                  className="mt-1 p-2 w-full border border-[#FFD700] rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-300">Tourist Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="mt-1 p-2 w-full border border-[#FFD700] rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-300">Tourist Image</label>
                <img src={user.photoURL} alt={user.displayName} className="rounded-full w-20 h-20 mb-4" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-300">Price</label>
                <input
                  type="text"
                  value={packageDetails.price}
                  readOnly
                  className="mt-1 p-2 w-full border border-[#FFD700] rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-300">Tour Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="mt-1 p-2 w-full border border-[#FFD700] rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 dark:text-gray-300">Tour Guide</label>
                <select className="mt-1 p-2 w-full border border-[#FFD700] rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" name="guide">
                  {tourGuides.map((guide) => (
                    <option key={guide._id} value={guide.name}>
                      {guide.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#008080] text-white p-2 rounded-lg mt-4"
              >
                Book Now
              </button>
            </form>
          )}
        </section>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Booking Confirmation"
        className="flex items-center justify-center fixed inset-0 z-50 outline-none focus:outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-white dark:bg-gray-50 dark:text-gray-800">
          <h2 className="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 fill-current shrink-0 dark:text-violet-600">
              <path d="M451.671,348.569,408,267.945V184c0-83.813-68.187-152-152-152S104,100.187,104,184v83.945L60.329,348.568A24,24,0,0,0,81.432,384h86.944c-.241,2.636-.376,5.3-.376,8a88,88,0,0,0,176,0c0-2.7-.135-5.364-.376-8h86.944a24,24,0,0,0,21.1-35.431ZM312,392a56,56,0,1,1-111.418-8H311.418A55.85,55.85,0,0,1,312,392ZM94.863,352,136,276.055V184a120,120,0,0,1,240,0v92.055L417.137,352Z"></path>
              <rect width="32" height="136" x="240" y="112"></rect>
              <rect width="32" height="32" x="240" y="280"></rect>
            </svg>
            Confirm your Booking
          </h2>
          <p className="flex-1 dark:text-gray-600">Your booking has been successfully made.</p>
          <div className="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
            <button
              onClick={() => setModalIsOpen(false)}
              className="px-6 py-2 rounded-sm"
            >
              Close
            </button>
            <Link to="/my-bookings" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
              Go to My Bookings
            </Link>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default PackageDetailsPage;