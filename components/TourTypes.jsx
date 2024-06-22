import { Link } from 'react-router-dom';

const TourTypes = () => {
    const tourTypes = [
        { name: 'Hiking', image: '/hiking.webp', link: '/tours/hiking' },
        { name: 'Beach', image: '/sports.webp', link: '/tours/beach' },
        { name: 'Walking', image: '/walking.webp', link: '/tours/walking' },
        { name: 'Wildlife', image: '/wildlife.webp', link: '/tours/wildlife' },
        { name: 'Air Rides', image: '/airrides.webp', link: '/tours/airrides' },
    ];

    return (
        <section className="bg-white dark:bg-gray-800 text-black dark:text-white">
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-[#008080]">Tour Type Section</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {tourTypes.map((type, index) => (
                        <Link
                            key={index}
                            to={type.link}
                            className="flex flex-col items-center space-y-4 bg-[#008080] shadow-lg rounded-lg p-4 hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-[#FFD700]"
                        >
                            <img src={type.image} alt={type.name} className="w-24 h-24 rounded-full border-2 border-[#FFD700] object-cover" />
                            <span className="text-lg font-semibold">{type.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TourTypes;
