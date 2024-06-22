import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      <div className="container mx-auto p-6 space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-bold">About Us</h2>
          <p className="font-serif text-lg text-gray-600 dark:text-gray-400">
            Welcome to Our Travel Community
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <img
              src="/mission.webp"
              alt="Our Mission"
              className="object-cover w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="text-center text-gray-600 dark:text-gray-400">
              To inspire and connect travelers from all around the world, sharing unique travel experiences and tips.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <img
              src="/community.webp"
              alt="Our Community"
              className="object-cover w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">Our Community</h3>
            <p className="text-center text-gray-600 dark:text-gray-400">
              A vibrant and diverse group of travelers who share their stories, experiences, and tips to help each other explore the world.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <img
              src="support.webp"
              alt="Support"
              className="object-cover w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">Support</h3>
            <p className="text-center text-gray-600 dark:text-gray-400">
              We provide resources and support to make your travel planning easier and your adventures more enjoyable.
            </p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold">Join Us on Our Journey</h3>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Whether you are a seasoned traveler or just starting your journey, our community is here to support and inspire you. Let's explore the world together!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
