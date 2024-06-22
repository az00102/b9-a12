// src/components/MyProfile.jsx
import { useEffect, useContext, useState } from 'react';
import useAxiosSecure from '../components/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [story, setStory] = useState({ title: '', excerpt: '', content: '' });
  const [guideInfo, setGuideInfo] = useState({ bio: '', experience: '', contact: '', education: '', skills: '' });
  const [stories, setStories] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "Profile - My Profile";
    if (user && user.email) {
      axiosSecure.get(`/api/profile`, {
        params: { email: user.email },
      })
        .then(response => {
          setProfile(response.data);
          if (response.data.story) setStory(response.data.story);
          setGuideInfo(prev => ({
            ...prev,
            bio: response.data.bio || '',
            experience: response.data.experience || '',
            contact: response.data.contact || '',
            education: response.data.education || '',
            skills: response.data.skills || ''
          }));
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });

      axiosSecure.get('/api/stories')
        .then(response => {
          setStories(response.data);
        })
        .catch(error => {
          console.error('Error fetching stories:', error);
        });
    }
  }, [user, axiosSecure]);

  const handleStorySubmit = () => {
    axiosSecure.post('/api/story', { email: user.email, ...story })
      .then(() => {
        toast.success('Story submitted successfully');
        setStory({ title: '', excerpt: '', content: '' });
      })
      .catch(error => {
        console.error('Error submitting story:', error);
        toast.error('Error submitting story');
      });
  };

  const handleGuideInfoSubmit = () => {
    axiosSecure.post('/api/profile', { email: user.email, ...guideInfo })
      .then(() => {
        toast.success('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        toast.error('Error updating profile');
      });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto dark:bg-gray-900 dark:text-white bg-white text-gray-900">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="mb-6">
        <p className="text-lg mb-2"><span className="font-semibold">Name:</span> {profile.name}</p>
        <p className="text-lg mb-2"><span className="font-semibold">Email:</span> {profile.email}</p>
        {profile.photoURL && (
          <img
            src={profile.photoURL}
            alt="Profile"
            className="w-40 h-40 object-cover rounded-full mb-4"
          />
        )}
      </div>

      {user && user.role === 'admin' && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Admin Information</h3>
          {/* Additional admin-specific information can be displayed here */}
        </div>
      )}

      {user && user.role === 'tourist' && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Add a Story</h3>
          <input
            className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            placeholder="Title"
            value={story.title}
            onChange={(e) => setStory({ ...story, title: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            placeholder="Excerpt"
            value={story.excerpt}
            onChange={(e) => setStory({ ...story, excerpt: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
            placeholder="Content"
            value={story.content}
            onChange={(e) => setStory({ ...story, content: e.target.value })}
          />
          <button
            className="bg-[#008080] text-white py-2 px-4 rounded mt-4"
            onClick={handleStorySubmit}
          >
            Submit
          </button>
        </div>
      )}

      {user && user.role === 'tourguide' && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Tour Guide Profile</h3>
          <div className="space-y-4">
            <textarea
              className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
              placeholder="Bio"
              value={guideInfo.bio}
              onChange={(e) => setGuideInfo({ ...guideInfo, bio: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
              placeholder="Experience"
              value={guideInfo.experience}
              onChange={(e) => setGuideInfo({ ...guideInfo, experience: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
              placeholder="Contact Details"
              value={guideInfo.contact}
              onChange={(e) => setGuideInfo({ ...guideInfo, contact: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
              placeholder="Education"
              value={guideInfo.education}
              onChange={(e) => setGuideInfo({ ...guideInfo, education: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
              placeholder="Skills"
              value={guideInfo.skills}
              onChange={(e) => setGuideInfo({ ...guideInfo, skills: e.target.value })}
            />
          </div>
          <button
            className="bg-[#008080] text-white py-2 px-4 rounded mt-4"
            onClick={handleGuideInfoSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
