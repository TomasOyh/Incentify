import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import CoursesPage from './CoursesPage';
import Header from './Header';
import Footer from './Footer';
import LoginPage from './LoginPage';
import CourseDetailPage from './CourseDetailPage';
import QuizPage from './QuizPage';
import AccountPage from './AccountPage';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userCourses, setUserCourses] = useState([
    { id: 1, title: 'Blockchain Basics' },
    { id: 2, title: 'Solidity Smart Contract Development' },
  ]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  const handleLogin = (account) => {
    setIsLoggedIn(true);
    setWalletAddress(account);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setWalletAddress('');
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header 
          onCategorySelect={handleCategorySelect}
          onLevelSelect={handleLevelSelect}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          walletAddress={walletAddress}
          userCourses={userCourses}
        />
        <div className="flex-grow">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/course/:courseId/unit/:unitId/quiz" element={<QuizPage />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/" element={<CoursesPage selectedCategory={selectedCategory} selectedLevel={selectedLevel} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
