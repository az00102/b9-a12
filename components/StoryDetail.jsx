import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { AuthContext } from "../providers/AuthProvider";

const StoryDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://b9-a12-serverrr.vercel.app/api/stories/${id}`);
        setStory(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch story details.");
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const shareUrl = window.location.href.replace("localhost:5000", "abc123.ngrok.io"); // Replace with your ngrok URL

  return (
    <section className="bg-white dark:bg-gray-800 text-black dark:text-white flex-grow py-10 min-h-[calc(100vh-16rem)]">
      <div className="container mx-auto px-4">
        {story && (
          <>
            <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{story.excerpt}</p>
            <div className="flex items-center mb-4">
              <img src={story.posterPhotoURL} alt={story.posterName} className="w-10 h-10 rounded-full mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{story.posterName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(story.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow mb-4">
              <p>{story.content}</p>
            </div>
            {user && (
              <div className="mt-4">
                <FacebookShareButton
                  url={shareUrl}
                  quote={story.title}
                  hashtag="#touristStory"
                  className="flex items-center"
                >
                  <FacebookIcon size={36} />
                  <span className="ml-2">Share on Facebook</span>
                </FacebookShareButton>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default StoryDetail;
