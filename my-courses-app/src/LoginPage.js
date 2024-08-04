import React from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import web3 from './web3';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      // Conectar a MetaMask
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        onLogin(account); // Pasar la dirección de la cuenta a la función de inicio de sesión
        navigate('/'); // Redirigir a la página de inicio después de iniciar sesión
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      <Link to="/" className="text-2xl font-bold mb-6"></Link>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Log in to your account</h1>
        <p className="text-center mb-4">Welcome back! Please enter your details.</p>
        <div className="flex flex-col space-y-4">
          <button onClick={handleLoginClick} className="bg-green-500 p-2 rounded-lg flex items-center justify-center">
            Connect Wallet
          </button>
        </div>
        <p className="text-center mt-4">
          Don't have an account? <a href="#" className="text-blue-500">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
