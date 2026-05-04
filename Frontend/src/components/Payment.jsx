import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaLock, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Payment = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    // Get course details from location state or fetch from API
    if (location.state) {
      console.log("Course data from location state:", location.state);
      setCourse(location.state);
      setLoading(false);
    } else {
      fetchCourseDetails();
    }
  }, [courseId, location.state]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      console.log("Fetching course details for ID:", courseId);
      console.log("Using token:", token);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Course data from API:", response.data);
      
      if (response.data && response.data.course) {
        setCourse(response.data.course);
      } else {
        setError("Course data not found");
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError(error.response?.data?.message || 'Failed to load course details');
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real application, you would integrate with a payment gateway here
      // For now, we'll simulate a successful payment
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark the course as paid
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/courses/${courseId}/mark-paid`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Payment successful! You are now enrolled in the course.');
      
      // Redirect to course learning page
      navigate(`/courses/${courseId}/learn`);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">{error || "The course you're trying to purchase doesn't exist."}</p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // Ensure course.price is a number, default to 0 if undefined
  const coursePrice = typeof course.price === 'number' ? course.price : 0;
  const tax = coursePrice * 0.1;
  const total = coursePrice + tax;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button 
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <FaArrowLeft className="mr-2" /> Back to Course
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="flex items-center mb-4">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title || 'Course thumbnail'}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-800">{course.title || 'Untitled Course'}</h3>
                  <p className="text-sm text-gray-500">{course.category || 'Uncategorized'}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-semibold">${coursePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <FaLock className="text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Secure payment</span>
                </div>
                <p className="text-sm text-gray-500">
                  Your payment information is encrypted and secure. We never store your credit card details.
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FaCreditCard className="mr-2" />
                  )}
                  {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 