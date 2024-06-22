import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from 'react-loading';

const TourTypePackages = () => {
    const { type } = useParams();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackagesByType = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://b9-a12-serverrr.vercel.app/api/packages/type/${type}`);
                setPackages(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch packages data.');
                setLoading(false);
            }
        };

        fetchPackagesByType();
    }, [type]);

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
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-[#008080]">{type.charAt(0).toUpperCase() + type.slice(1)} Packages</h2>
                {packages.length === 0 ? (
                    <div className="text-center mt-10">No packages found for {type}.</div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6">
                        {packages.map(pkg => (
                            <div key={pkg._id} className="shadow-xl border-solid border-2 border-[#FFD700] hover:shadow-2xl transition-shadow w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
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
                )}
            </div>
        </section>
    );
};

export default TourTypePackages;
