import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBriefcase, FaLaptopCode, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const Opportunities = ({ courseId }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please log in to view opportunities');
          return;
        }
        
        let url = `${import.meta.env.VITE_BASE_URI}/api/opportunities`;
        
        // If courseId is provided, fetch opportunities for that specific course
        if (courseId) {
          url = `${import.meta.env.VITE_BASE_URI}/api/opportunities/course/${courseId}`;
        } else {
          // Otherwise, fetch opportunities based on user's completed courses
          url = `${import.meta.env.VITE_BASE_URI}/api/opportunities/user`;
        }
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setOpportunities(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setError('Failed to load opportunities. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchOpportunities();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No opportunities found!</strong>
        <span className="block sm:inline"> Check back later for new opportunities.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {courseId ? 'Opportunities for this Course' : 'Recommended Opportunities'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <div key={opportunity._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {opportunity.type === 'micro-internship' ? (
                  <FaBriefcase className="text-blue-500 text-xl mr-2" />
                ) : (
                  <FaLaptopCode className="text-green-500 text-xl mr-2" />
                )}
                <h3 className="text-xl font-semibold text-gray-800">{opportunity.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4">{opportunity.description}</p>
              
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <span className="text-gray-700">
                  {opportunity.isRemote ? 'Remote' : opportunity.location}
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                <FaClock className="text-gray-500 mr-2" />
                <span className="text-gray-700">{opportunity.duration}</span>
              </div>
              
              <div className="flex items-center mb-4">
                <FaMoneyBillWave className="text-gray-500 mr-2" />
                <span className="text-gray-700">{opportunity.compensation}</span>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
              >
                Apply Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities; 