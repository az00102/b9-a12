import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosSecure from '../components/useAxiosSecure';

const RequestToAdmin = () => {
  const { user } = useContext(AuthContext);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user && user.email) {
      fetchRequestStatus();
    }
  }, [user]);

  const fetchRequestStatus = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(`/api/profile?email=${user.email}`);
      if (response.data.requestRole) {
        setRequestStatus('pending');
      } else {
        setRequestStatus('none');
      }
    } catch (error) {
      console.error('Error fetching request status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.post('/api/request-tour-guide', { email: user.email });
      if (response.data.success) {
        setRequestStatus('pending');
        toast.success('Request sent successfully');
      } else {
        toast.error('Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Error sending request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Request to Become a Tour Guide</h2>
      {requestStatus === 'pending' ? (
        <p className="text-yellow-500 text-center">Your request is in progress :) !</p>
      ) : (
        <button
          onClick={handleRequest}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Request to become a Tour Guide
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default RequestToAdmin;
