import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../providers/AuthProvider';
import Loading from 'react-loading';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TourGuideProfile = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuide = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://b9-a12-serverrr.vercel.app/api/guides/${id}`);
                setGuide(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch guide details.');
                setLoading(false);
            }
        };

        fetchGuide();
    }, [id]);

    const handleReviewSubmit = async () => {
        if (!user) {
            toast.error('You need to be logged in to submit a review.');
            return;
        }

        try {
            const review = { rating, comment, email: user.email };
            await axios.post(`https://b9-a12-serverrr.vercel.app/api/guides/${id}/review`, review);
            toast.success('Review submitted successfully');
            setGuide((prevGuide) => ({
                ...prevGuide,
                reviews: [...(prevGuide.reviews || []), review],
            }));
            setRating(0);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Error submitting review');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading type="spin" color="#000" height={50} width={50} />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <section className="bg-white dark:bg-gray-800 text-black dark:text-white">
            <ToastContainer />
            <div className="container mx-auto p-6">
                {guide && (
                    <>
                        <div className="max-w-md p-8 sm:flex sm:space-x-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                            <div className="flex-shrink-0 w-full mb-6 h-44 sm:h-32 sm:w-32 sm:mb-0">
                                <img src={guide.photoURL} alt={guide.name} className="object-cover object-center w-full h-full rounded bg-gray-500" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <h2 className="text-2xl font-semibold">{guide.name}</h2>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Tour Guide</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-label="Email address" className="w-4 h-4">
                                            <path fill="currentColor" d="M274.6,25.623a32.006,32.006,0,0,0-37.2,0L16,183.766V496H496V183.766ZM464,402.693,339.97,322.96,464,226.492ZM256,51.662,454.429,193.4,311.434,304.615,256,268.979l-55.434,35.636L57.571,193.4ZM48,226.492,172.03,322.96,48,402.693ZM464,464H48V440.735L256,307.021,464,440.735Z"></path>
                                        </svg>
                                        <span className="text-gray-600 dark:text-gray-300">{guide.email}</span>
                                    </span>
                                    <span className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-label="Phonenumber" className="w-4 h-4">
                                            <path fill="currentColor" d="M449.366,89.648l-.685-.428L362.088,46.559,268.625,171.176l43,57.337a88.529,88.529,0,0,1-83.115,83.114l-57.336-43L46.558,362.088l42.306,85.869.356.725.429.684a25.085,25.085,0,0,0,21.393,11.857h22.344A327.836,327.836,0,0,0,461.222,133.386V111.041A25.084,25.084,0,0,0,449.366,89.648Zm-20.144,43.738c0,163.125-132.712,295.837-295.836,295.837h-18.08L87,371.76l84.18-63.135,46.867,35.149h5.333a120.535,120.535,0,0,0,120.4-120.4v-5.333l-35.149-46.866L371.759,87l57.463,28.311Z"></path>
                                        </svg>
                                        <span className="text-gray-600 dark:text-gray-300">{guide.contact}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                            <h3 className="text-xl font-semibold mb-2">Education</h3>
                            <p>{guide.education}</p>
                        </div>
                        <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                            <h3 className="text-xl font-semibold mb-2">Skills</h3>
                            <p>{guide.skills}</p>
                        </div>
                        <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                            <h3 className="text-xl font-semibold mb-2">Experience</h3>
                            <p>{guide.experience}</p>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold mb-4">Reviews</h3>
                            {guide.reviews && guide.reviews.map((review, index) => (
                                <div key={index} className="mb-4 p-4 border rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                                    <p><span className="font-semibold">Rating:</span> {review.rating}</p>
                                    <p><span className="font-semibold">Comment:</span> {review.comment}</p>
                                    <p><span className="font-semibold">By:</span> {review.email}</p>
                                </div>
                            ))}
                        </div>
                        {user && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
                                <div className="mb-4">
                                    <label className="block text-lg mb-2">Rating</label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <label key={value} className="flex items-center space-x-1">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    className="radio radio-success"
                                                    checked={rating === value}
                                                    onChange={() => setRating(value)}
                                                />
                                                <span>{value}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg mb-2">Comment</label>
                                    <textarea
                                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="bg-[#008080] text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                                    onClick={handleReviewSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default TourGuideProfile;
