import { Swiper, SwiperSlide } from 'swiper/react';
import { Helmet } from "react-helmet-async";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import TourismAndTravelGuide from "./TourismAndTravelGuide";
import TourTypes from "./TourTypes";
import TouristStories from './TouristStories';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>EpicEscapes | Home</title>
            </Helmet>
            {/* Banner Section */}
            <section>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="hero min-h-screen bg-[url('/banner1.webp')]">
                            <div className="hero-overlay bg-opacity-80"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-md">
                                    <motion.div
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <h1 className="text-4xl font-bold leading-none sm:text-5xl text-[#FF6F61]">Discover Paradise!</h1>
                                        <p className="px-8 mt-8 mb-12 text-lg text-[#FF6F61]">Explore the world's most stunning beaches.</p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="hero min-h-screen bg-[url('/banner2.webp')]">
                            <div className="hero-overlay bg-opacity-80"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-lg">
                                    <motion.div
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <h1 className="text-4xl font-bold leading-none sm:text-5xl text-[#FF6F61]">Escape to the Mountains</h1>
                                        <p className="px-8 mt-8 mb-12 text-lg text-[#FF6F61]">Discover breathtaking adventures and serene landscapes.</p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="hero min-h-screen bg-[url('/banner3.webp')]">
                            <div className="hero-overlay bg-opacity-80"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-md">
                                    <motion.div
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <h1 className="text-4xl font-bold leading-none sm:text-5xl text-[#FF6F61]">Marvel at Niagara Falls</h1>
                                        <p className="px-8 mt-8 mb-12 text-lg text-[#FF6F61]">Witness the majestic power and beauty of nature's wonder.</p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </section>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <TourismAndTravelGuide />
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <TourTypes />
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
            >
                <TouristStories />
            </motion.div>
        </div>
    );
};

export default Home;
