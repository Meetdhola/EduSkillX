import React, { useState } from 'react';
import { FaCubes, FaCamera, FaMagic, FaHandPaper, FaBolt, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const ArVr = () => {
  const [mode, setMode] = useState('AR');

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4">
        <div>
          <img src="/vr-goggles.svg" alt="Logo" className="h-8 w-8" />
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Courses</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Get Started
        </button>
      </nav>

      {/* Mode Toggle */}
      <div className="flex justify-center mt-10">
        <div className="flex bg-white rounded-full p-1 shadow-md">
          <button
            className={`px-6 py-2 rounded-full ${mode === 'AR' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setMode('AR')}
          >
            AR Mode
          </button>
          <button
            className={`px-6 py-2 rounded-full ${mode === 'VR' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setMode('VR')}
          >
            VR Mode
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AR Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">AR Object Recognition</h2>
          
          {/* AR Object Visualization - Matches the image exactly */}
          <div className="rounded-lg overflow-hidden mb-6 relative h-64 bg-gradient-to-r from-purple-100 to-blue-200">
            {/* 3D Platforms */}
            <div className="absolute bottom-6 left-12 w-24 h-6 rounded-full bg-blue-200"></div>
            <div className="absolute bottom-6 right-20 w-32 h-6 rounded-full bg-blue-200"></div>
            <div className="absolute bottom-6 left-1/3 w-12 h-12 bg-blue-200"></div>
            
            {/* Tennis racket object */}
            <div className="absolute bottom-14 left-12 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-gray-400"></div>
              <div className="w-2 h-8 bg-gray-400"></div>
              <div className="w-6 h-6 bg-white"></div>
            </div>
            
            {/* 3D floating spheres */}
            <div className="absolute top-10 left-1/4 w-8 h-8 rounded-full bg-purple-300 opacity-80"></div>
            <div className="absolute top-1/4 right-1/3 w-20 h-20 rounded-full bg-blue-300 opacity-80"></div>
            <div className="absolute top-1/3 left-1/2 w-6 h-6 rounded-full bg-purple-300 opacity-80"></div>
            <div className="absolute top-8 right-1/4 w-10 h-10 rounded-full bg-blue-300 opacity-80"></div>
          </div>
          
          {/* AR Feature Icons */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-100 p-3 rounded flex flex-col items-center">
              <FaCubes className="text-gray-700 mb-1" />
              <span className="text-sm">3D Objects</span>
            </div>
            <div className="bg-gray-100 p-3 rounded flex flex-col items-center">
              <FaCamera className="text-gray-700 mb-1" />
              <span className="text-sm">Scanner</span>
            </div>
            <div className="bg-gray-100 p-3 rounded flex flex-col items-center">
              <FaMagic className="text-gray-700 mb-1" />
              <span className="text-sm">Effects</span>
            </div>
          </div>
        </div>

        {/* VR Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">VR Learning Room</h2>
          
          {/* VR Classroom Visualization - Matches the image exactly */}
          <div className="rounded-lg overflow-hidden mb-6 h-64 bg-gray-100">
            <div className="h-full w-full relative bg-blue-50">
              {/* Classroom ceiling */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-white flex justify-center items-center">
                <div className="grid grid-cols-3 gap-8 w-full px-8">
                  <div className="bg-gray-200 h-6"></div>
                  <div className="bg-gray-200 h-6"></div>
                  <div className="bg-gray-200 h-6"></div>
                </div>
              </div>
              
              {/* Projector screen */}
              <div className="absolute top-14 left-0 right-0 h-20 flex justify-center">
                <div className="w-2/3 h-full bg-white border border-gray-300"></div>
              </div>
              
              {/* Classroom tables */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <div className="grid grid-cols-2 gap-4 w-3/4">
                  <div className="bg-white h-10 shadow-sm"></div>
                  <div className="bg-white h-10 shadow-sm"></div>
                </div>
              </div>
              
              {/* Side furniture */}
              <div className="absolute bottom-8 right-4 h-32 w-12 bg-white shadow-sm"></div>
              
              {/* Red accent light */}
              <div className="absolute bottom-8 right-4 h-4 w-4 bg-red-400 rounded-full shadow-lg"></div>
            </div>
          </div>
          
          {/* Haptic Feedback Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Haptic Feedback Demo</h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded">
                <FaHandPaper className="text-gray-700" />
                <span>Touch Simulation</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded">
                <FaBolt className="text-gray-700" />
                <span>Force Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-600">© 2025 EduSkillX. All rights reserved.</p>
          <div className="flex space-x-4">
            <FaTwitter className="text-gray-600 hover:text-blue-600 cursor-pointer" />
            <FaFacebook className="text-gray-600 hover:text-blue-600 cursor-pointer" />
            <FaInstagram className="text-gray-600 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArVr;
