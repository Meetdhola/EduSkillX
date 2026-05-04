import React from 'react';
import Opportunities from '../components/Opportunities';
import { Helmet } from 'react-helmet';

const OpportunitiesPage = () => {
  return (
    <>
      <Helmet>
        <title>Career Opportunities | EduSkillX</title>
        <meta name="description" content="Find micro-internships and freelancing opportunities based on your completed courses" />
      </Helmet>
      
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Career Opportunities
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover micro-internships and freelancing opportunities that match your skills and help you gain real-world experience.
            </p>
          </div>
          
          <Opportunities />
        </div>
      </div>
    </>
  );
};

export default OpportunitiesPage; 