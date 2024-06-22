// src/components/AllPackages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from 'react-loading';

const AllPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('https://b9-a12-serverrr.vercel.app/api/packages');
                setPackages(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch packages data.');
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

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
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-2 text-center">All Packages</h2>
            <p className="text-center mb-10">Explore all of our travel packages curated for you.</p>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map(pkg => (
                    <div key={pkg._id} className="shadow-xl border-solid border-2 border-[#FFD700] hover:shadow-2xl transition-shadow">
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
                            <img src={`data:image/jpeg;base64,${pkg.images[0].toString('base64')}`} alt={pkg.packageName} className="w-full h-48 object-cover mb-4" />
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="card-title text-xl font-bold mb-2">{pkg.packageName}</h2>
                                </div>
                                <p>Tour Type: {pkg.type}</p>
                                <p>Price: {pkg.price}</p>
                                <Link to={`/package/${pkg._id}`} className="bg-[#008080] text-white px-4 py-2 rounded mt-4 inline-block">View Package</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPackages;
