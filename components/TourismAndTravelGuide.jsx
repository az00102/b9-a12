import React, { useState, useEffect, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../providers/AuthProvider';
import Loading from 'react-loading';
import useAxiosSecure from '../components/useAxiosSecure';
import axios from 'axios';

const TourismAndTravelGuide = () => {
  const { user } = useContext(AuthContext);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchPackages();
    fetchGuides();
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const response = await axios.get('https://b9-a12-serverrr.vercel.app/api/packages');
      setPackages(response.data);
      setLoadingPackages(false);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Error fetching packages');
      setLoadingPackages(false);
    }
  };

  const fetchGuides = async () => {
    setLoadingGuides(true);
    try {
      const response = await axios.get('https://b9-a12-serverrr.vercel.app/api/guides');
      setGuides(response.data);
      setLoadingGuides(false);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast.error('Error fetching guides');
      setLoadingGuides(false);
    }
  };

  const fetchWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const token = localStorage.getItem('access-token');
      const response = await axios.get(`https://b9-a12-serverrr.vercel.app/api/wishlist/${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWishlist(response.data.map(item => item.packageId));
      setLoadingWishlist(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoadingWishlist(false);
    }
  };

  const handleWishlistToggle = async (packageId) => {
    if (!user) {
      toast.error('You need to be logged in to manage your wishlist.');
      return;
    }

    try {
      const token = localStorage.getItem('access-token');
      if (wishlist.includes(packageId)) {
        await axios.delete('https://b9-a12-serverrr.vercel.app/api/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: { email: user.email, packageId }
        });
        setWishlist(wishlist.filter(id => id !== packageId));
        toast.success('Package removed from wishlist.');
      } else {
        await axios.post('https://b9-a12-serverrr.vercel.app/api/wishlist', { email: user.email, packageId }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlist([...wishlist, packageId]);
        toast.success('Package added to wishlist.');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Error updating wishlist.');
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 text-black dark:text-white relative">
      <ToastContainer />
      <div className="container mx-auto p-4 relative">
        <Tabs>
          <TabList className="flex items-center justify-center space-x-4 mb-4 border-b-2 border-gray-200 dark:border-gray-700 font-bold">
            <Tab className="px-4 py-2 text-lg cursor-pointer focus:outline-none focus:border-[#FFD700] focus:text-[#FFD700] border-transparent" selectedClassName="border-b-4 border-[#FFD700] text-[#FFD700]">Overview</Tab>
            <Tab className="px-4 py-2 text-lg cursor-pointer focus:outline-none focus:border-[#FFD700] focus:text-[#FFD700] border-transparent" selectedClassName="border-b-4 border-[#FFD700] text-[#FFD700]">Our Packages</Tab>
            <Tab className="px-4 py-2 text-lg cursor-pointer focus:outline-none focus:border-[#FFD700] focus:text-[#FFD700] border-transparent" selectedClassName="border-b-4 border-[#FFD700] text-[#FFD700]">Meet Our Tour Guides</Tab>
          </TabList>

          <TabPanel>
            <div className="p-4 flex flex-col h-full">
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <p className="mb-4">Welcome to our travel guide! Here, you'll find all the information you need to make the most of your trip.</p>
              <div className="flex-1 flex justify-center items-center">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/exI_hD_4jAM?si=YvNdWnQ75P078GmP" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="p-4 flex flex-col h-full">
              <h2 className="text-3xl font-bold mb-2 text-center">Our Packages</h2>
              <p className="text-center mb-10">Explore our travel packages curated for you.</p>
              {loadingPackages ? (
                <div className="flex justify-center items-center">
                  <Loading type="spin" color="#000" height={50} width={50} />
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map(pkg => (
                    <div key={pkg._id} className="shadow-xl border-solid border-2 border-[#FFD700] hover:shadow-2xl transition-shadow">
                      <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
                        <img src={`data:image/jpeg;base64,${pkg.images[0].toString('base64')}`} alt={pkg.packageName} className="w-full h-48 object-cover mb-4" />
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="card-title text-xl font-bold mb-2">{pkg.packageName}</h2>
                            <button className="text-[#FFD700]" aria-label="Add to Wishlist" onClick={() => handleWishlistToggle(pkg._id)}>
                              {wishlist.includes(pkg._id) ? '❤️' : '🤍'}
                            </button>
                          </div>
                          <p>Tour Type: {pkg.type}</p>
                          <p>Price: {pkg.price}</p>
                          <Link to={`/package/${pkg._id}`} className="bg-[#008080] text-white px-4 py-2 rounded mt-4 inline-block">View Package</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <Link to="/all-packages" className="bg-[#008080] text-white px-4 py-2 rounded">All Packages</Link>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="p-4 flex flex-col h-full">
              <h2 className="text-3xl font-bold mb-2 text-center">Meet Our Tour Guides</h2>
              <p className="text-center mb-10">Get to know the experts who will make your trip unforgettable.</p>
              {loadingGuides ? (
                <div className="flex justify-center items-center">
                  <Loading type="spin" color="#000" height={50} width={50} />
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guides.map(guide => (
                    <div key={guide._id} className="shadow-xl border-solid border-2 border-[#FFD700] hover:shadow-2xl transition-shadow">
                      <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
                        <img src={guide.photoURL} alt={guide.name} className="w-full h-48 object-cover mb-4" />
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="card-title text-xl font-bold mb-2">{guide.name}</h2>
                          </div>
                          <p>{guide.expertise || 'Expert in providing excellent tour experiences.'}</p>
                          <Link to={`/guide/${guide._id}`} className="bg-[#008080] text-white px-4 py-2 rounded mt-4 inline-block">Details</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
};

export default TourismAndTravelGuide;
