import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Community = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://b9-a12-serverrr.vercel.app/api/community');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching community posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <section className="bg-white dark:bg-gray-800 text-black dark:text-white">
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-2 text-center dark:text-white">Community</h2>
                <p className="text-lg text-center mb-6 dark:text-gray-300">Join the conversation and see what others are saying!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map(post => (
                        <div key={post._id} className="flex flex-col w-full border-2 border-[#008080] max-w-lg p-6 mx-auto divide-y rounded-md bg-white dark:bg-gray-800 dark:text-gray-200">
                            <div className="flex justify-between p-4">
                                <div>
                                    <h4 className="font-bold">{post.authorName}</h4>
                                    <span className="text-xs dark:text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-yellow-500 dark:text-yellow-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
                                        <path d="M494,198.671a40.536,40.536,0,0,0-32.174-27.592L345.917,152.242,292.185,47.828a40.7,40.7,0,0,0-72.37,0L166.083,152.242,50.176,171.079a40.7,40.7,0,0,0-22.364,68.827l82.7,83.368-17.9,116.055a40.672,40.672,0,0,0,58.548,42.538L256,428.977l104.843,52.89a40.69,40.69,0,0,0,58.548-42.538l-17.9-116.055,82.7-83.368A40.538,40.538,0,0,0,494,198.671Zm-32.53,18.7L367.4,312.2l20.364,132.01a8.671,8.671,0,0,1-12.509,9.088L256,393.136,136.744,453.3a8.671,8.671,0,0,1-12.509-9.088L144.6,312.2,50.531,217.37a8.7,8.7,0,0,1,4.778-14.706L187.15,181.238,248.269,62.471a8.694,8.694,0,0,1,15.462,0L324.85,181.238l131.841,21.426A8.7,8.7,0,0,1,461.469,217.37Z"></path>
                                    </svg>
                                    <span className="text-xl font-bold">{post.rating}</span>
                                </div>
                            </div>
                            <div className="p-4 space-y-2 text-sm">
                                <p>{post.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Community;
