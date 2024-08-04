import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import image5 from './assets/image5.jpg';
import image4 from './assets/image4.jpg';
import image6 from './assets/image6.jpg';
import image3 from './assets/image3.jpg';

const allCourses = [
  {
    id: 1,
    title: 'Blockchain Basics',
    level: 'Beginner',
    lessons: 20,
    duration: '3hrs',
    description: 'Learn how blockchains work, smart contracts, and how to sign your first transaction.',
    exams: 1,
    category: 'DeFi',
    image: image5
  },
  {
    id: 2,
    title: 'Solidity Smart Contract Development',
    level: 'Beginner',
    lessons: 59,
    duration: '5hrs',
    description: 'Start here if you’re new to writing smart contracts! Learn Solidity from industry-leading experts.',
    exams: 2,
    category: 'Solidity',
    image: image4
  },
  {
    id: 3,
    title: 'How to develop in Scroll',
    level: 'Intermediate',
    lessons: 103,
    duration: '10hrs',
    description: 'Learn advanced web3 development concepts.',
    exams: 3,
    category: 'DeFi',
    image: image6
  },
  {
    id: 4,
    title: 'Advanced Blockchain Development',
    level: 'Advanced',
    lessons: 200,
    duration: '15hrs',
    description: 'Master advanced blockchain development techniques.',
    exams: 4,
    category: 'Security',
    image: image3
  },
];

const CoursesPage = ({ selectedCategory }) => {
  const [courses, setCourses] = useState(allCourses);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setCourses(allCourses);
    } else {
      const filteredCourses = allCourses.filter(course => course.level === selectedCategory);
      setCourses(filteredCourses);
    }
  }, [selectedCategory]);

  const getCategoryColor = () => {
    return 'bg-gray-600 text-white'; // Cambiar a un color más gris
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500 text-white';
      case 'Intermediate':
        return 'bg-blue-500 text-white';
      case 'Advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Hands-on courses for all levels</h1>
        <p className="text-lg mb-12 text-center">
          Learn blockchain fundamentals, smart contract development, and the auditing skills you need, online at your own pace. From blockchain concepts, essentials to Solidity, security, and web3 DevOps.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-md flex flex-col justify-between min-h-full p-4 hover:shadow-lg transition-shadow duration-300">
              <img src={course.image} alt="Course" className="w-full h-32 object-cover rounded-t-lg mb-4" />
              <div className="mb-4 flex justify-center space-x-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor()}`}>
                  {course.category}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-center">{course.title}</h2>
              <div className="border-t border-gray-700 my-4"></div>
              {course.description && <p className="mb-4 text-center">{course.description}</p>}
              <div className="flex justify-around mb-4 text-center">
                <p><span className="font-bold">Lessons:</span> {course.lessons}</p>
                <p><span className="font-bold">Exams:</span> {course.exams}</p>
                <p><span className="font-bold">Duration:</span> {course.duration}</p>
              </div>
              <Link to={`/course/${course.id}`} className="text-center mt-4">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full">
                  Ir a curso
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
