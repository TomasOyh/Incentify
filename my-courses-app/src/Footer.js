import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">Contact us: team@incentify.com</p>
        <p className="mb-2">Follow us on social media</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-blue-500 hover:text-blue-400 transition duration-300">Facebook</a>
          <a href="#" className="text-blue-500 hover:text-blue-400 transition duration-300">Twitter</a>
          <a href="#" className="text-blue-500 hover:text-blue-400 transition duration-300">Instagram</a>
        </div>
        <p className="mt-4">&copy; 2024 Incentify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
