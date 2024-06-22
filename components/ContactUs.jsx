import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      <div className="container mx-auto p-6 space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-bold">Contact Us</h2>
          <p className="font-serif text-lg text-gray-600 dark:text-gray-400">
            We're here to help you with your travel needs and questions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
            <form className="w-full space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-600 dark:text-gray-400">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-400">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-gray-600 dark:text-gray-400">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-yellow-500 rounded-md shadow-md hover:bg-yellow-600"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="flex flex-col justify-center p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div>
              <h3 className="text-2xl font-semibold">Contact Information</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Feel free to reach out to us via email or phone.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaEnvelope className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">contact@travelcommunity.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">+123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">123 Travel St, Adventure City, TX 12345</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Follow Us</h3>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500">
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500">
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500">
                  <FaLinkedinIn className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
