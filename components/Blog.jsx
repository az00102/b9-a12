import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://b9-a12-serverrr.vercel.app/api/blogs');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <section className="py-6 sm:py-12 bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
            <div className="container p-6 mx-auto space-y-8">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold">Latest Travel Stories</h2>
                    <p className="font-serif text-sm text-gray-600 dark:text-gray-400">Discover the latest travel experiences and tips from our community</p>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <article key={post._id} className="flex flex-col bg-white dark:bg-gray-900 dark:text-gray-100 border-2 border-[#FFD700] rounded-lg shadow-md">
                            <a href="#" aria-label={post.title}>
                                <img
                                    alt={post.title}
                                    className="object-cover w-full h-52 rounded-t-lg"
                                    src={post.imageUrl}
                                />
                            </a>
                            <div className="flex flex-col flex-1 p-6">
                                <a href="#" aria-label={post.title} className="text-xs font-bold tracking-wider uppercase hover:underline text-[#008080] dark:text-[#008080]">
                                    {post.category}
                                </a>
                                <h3 className="flex-1 py-2 text-lg font-semibold leading-snug">{post.title}</h3>
                                <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs text-gray-600 dark:text-gray-400">
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                    <span>{post.views} views</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
