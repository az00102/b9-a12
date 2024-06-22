import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import useAxiosSecure from '../components/useAxiosSecure';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTINGL_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?expiration=600?key=${image_hosting_key}`;

const AddPackage = () => {
  const [packageName, setPackageName] = useState('');
  const [images, setImages] = useState([]);
  const [about, setAbout] = useState('');
  const [tourPlan, setTourPlan] = useState([{ day: '', info: '' }]);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState('Default Guide');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Hiking');
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "Admin Dashboard - Add Package";
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get('/api/guides');
      setGuides(response.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast.error('Error fetching guides');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    setImages([...e.target.files]);
  };

  const handleTourPlanChange = (index, field, value) => {
    const newTourPlan = [...tourPlan];
    newTourPlan[index][field] = value;
    setTourPlan(newTourPlan);
  };

  const addDay = () => {
    setTourPlan([...tourPlan, { day: '', info: '' }]);
  };

  const validateForm = () => {
    if (!packageName || !about || !price || !type || images.length === 0 || selectedGuide === 'Default Guide') {
      toast.error('Please fill out all fields');
      return false;
    }
    if (price <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }
    for (let plan of tourPlan) {
      if (!plan.day || !plan.info) {
        toast.error('Please fill out all tour plan fields');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('packageName', packageName);
    images.forEach(image => formData.append('images', image));
    formData.append('about', about);
    formData.append('tourPlan', JSON.stringify(tourPlan));
    formData.append('guide', selectedGuide);
    formData.append('price', price);
    formData.append('type', type);

    setLoading(true);
    try {
      console.log('Submitting package with data:', {
        packageName,
        about,
        tourPlan,
        guide: selectedGuide,
        price,
        type,
        images: images.length
      });
      await axiosSecure.post('/api/packages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Package added successfully!');
      setPackageName('');
      setImages([]);
      setAbout('');
      setTourPlan([{ day: '', info: '' }]);
      setSelectedGuide('Default Guide');
      setPrice('');
      setType('Hiking');
    } catch (error) {
      console.error('Error adding package:', error);
      toast.error('Error adding package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto dark:bg-gray-900 dark:text-white bg-white text-gray-900">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Add Package</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Package Name</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">About The Tour</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Tour Plan</label>
          {tourPlan.map((plan, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Day"
                value={plan.day}
                onChange={(e) => handleTourPlanChange(index, 'day', e.target.value)}
                className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
                required
              />
              <textarea
                placeholder="Info"
                value={plan.info}
                onChange={(e) => handleTourPlanChange(index, 'info', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addDay} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
            <FaInfoCircle className="mr-2" /> Add Day
          </button>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click "Add Day" to include information for each day of the tour.</p>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Select Guide</label>
          <select
            value={selectedGuide}
            onChange={(e) => setSelectedGuide(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            required
          >
            <option value="" disabled>Select a guide</option>
            <option value="Default Guide">Default Guide</option>
            {guides.map(guide => (
              <option key={guide._id} value={guide.name}>{guide.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            required
          >
            <option value="Hiking">Hiking</option>
            <option value="Beach">Beach</option>
            <option value="Walking">Walking</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Air Rides">Air Rides</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            required
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
          {loading ? 'Adding...' : 'Add Package'}
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
