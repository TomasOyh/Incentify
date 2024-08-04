import React, { useState } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { Link } from 'react-router-dom';
import web3 from './web3';
import SimpleContract from './SimpleContract.json';
import logo from './assets/logo.png';

const CONTRACT_ADDRESS = '0xFD03711f60AaE05306C339A017dBE94371f5Dbe8';

const Header = ({ onCategorySelect, onTagSelect, isLoggedIn, onLogout, walletAddress, userCourses }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
    setCoursesDropdownOpen(false);
    onCategorySelect(category);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setTagDropdownOpen(false);
    onTagSelect(tag);
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setCoursesDropdownOpen(false);
  };

  const handleCoursesClick = () => {
    setCoursesDropdownOpen(!coursesDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const createCourse = async () => {
    try {
      const contract = new web3.eth.Contract(SimpleContract.abi, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const costUSD = 10; // Ejemplo de costo en USD
      const durationInDays = 30; // Ejemplo de duración
      await contract.methods.createCourse(costUSD, durationInDays).send({ from: account });
      alert('Curso creado exitosamente!');
    } catch (error) {
      console.error('Error creando el curso:', error);
      alert('Hubo un error al crear el curso.');
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Logo" className="h-8 mr-2" />
      </Link>
      <div className="flex-1 flex justify-center items-center space-x-4">
        <div className="relative">
          <button
            className="flex items-center bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
          >
            Categorías <IoIosArrowDown className="ml-1" />
          </button>
          {tagDropdownOpen && (
            <div className="absolute left-0 mt-2 bg-gray-700 rounded-lg shadow-lg w-40">
              <button onClick={() => handleTagSelect('All')} className="block px-4 py-2 text-white hover:bg-gray-600">All</button>
              <button onClick={() => handleTagSelect('DeFi')} className="block px-4 py-2 text-white hover:bg-gray-600">DeFi</button>
              <button onClick={() => handleTagSelect('Security')} className="block px-4 py-2 text-white hover:bg-gray-600">Security</button>
              <button onClick={() => handleTagSelect('Solidity')} className="block px-4 py-2 text-white hover:bg-gray-600">Solidity</button>
            </div>
          )}
        </div>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search courses"
            className="bg-gray-700 text-white p-2 rounded-lg w-full pl-10 focus:outline-none focus:bg-gray-600"
          />
          <FaSearch className="absolute left-2 top-2 text-gray-400" />
        </div>
        <div className="relative">
          <button
            className="flex items-center bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Nivel <IoIosArrowDown className="ml-1" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg w-40">
              <button onClick={() => handleCategorySelect('All')} className="block px-4 py-2 text-white hover:bg-gray-600">All</button>
              <button onClick={() => handleCategorySelect('Beginner')} className="block px-4 py-2 text-white hover:bg-gray-600">Beginner</button>
              <button onClick={() => handleCategorySelect('Intermediate')} className="block px-4 py-2 text-white hover:bg-gray-600">Intermediate</button>
              <button onClick={() => handleCategorySelect('Advanced')} className="block px-4 py-2 text-white hover:bg-gray-600">Advanced</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <div className="relative">
              <button onClick={createCourse} className="bg-blue-500 p-2 rounded-lg flex items-center hover:bg-blue-400 transition duration-300">
                Subir un curso
              </button>
            </div>
            <div className="relative">
              <button
                className="flex items-center bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={handleCoursesClick}
              >
                Mis cursos <IoIosArrowDown className="ml-1" />
              </button>
              {coursesDropdownOpen && (
                <div className="absolute left-0 mt-2 bg-gray-700 rounded-lg shadow-lg w-40">
                  {userCourses.length > 0 ? (
                    userCourses.map((course, index) => (
                      <Link key={index} to={`/course/${course.id}`} className="block px-4 py-2 text-white hover:bg-gray-600">{course.title}</Link>
                    ))
                  ) : (
                    <p className="block px-4 py-2 text-white">No courses</p>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="flex items-center bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={handleProfileClick}
              >
                {walletAddress} <IoIosArrowDown className="ml-1" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg w-40">
                  <Link to="/account" className="block px-4 py-2 text-white hover:bg-gray-600">Mi cuenta</Link>
                  <Link to="/settings" className="block px-4 py-2 text-white hover:bg-gray-600">Ajustes</Link>
                  <Link to="/wallet" className="block px-4 py-2 text-white hover:bg-gray-600">Mi wallet</Link>
                  <div className="flex justify-center mt-2">
                    <button onClick={onLogout} className="block px-4 py-2 text-white hover:bg-gray-600">Cerrar sesión</button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-blue-500 p-2 rounded-lg flex items-center hover:bg-blue-400 transition duration-300">
              <FaUser className="mr-2" /> Log in
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
