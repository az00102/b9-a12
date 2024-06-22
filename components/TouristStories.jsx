import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TouristStories = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('https://b9-a12-serverrr.vercel.app/api/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-800 text-black dark:text-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Tourist Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.slice(0, 4).map((story) => (
            <Link key={story._id} to={`/story/${story._id}`} className="block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{story.excerpt}</p>
              <div className="mt-4 text-right">
                <button className="text-blue-500 hover:underline">Read More</button>
              </div>
              <div className="flex items-center mt-4">
                <img src={story.posterPhotoURL} alt={story.posterName} className="w-8 h-8 rounded-full mr-2" />
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{story.posterName}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(story.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/all-stories" className="bg-[#008080] text-white px-4 py-2 rounded">All Stories</Link>
        </div>
      </div>
    </section>
  );
};

export default TouristStories;
