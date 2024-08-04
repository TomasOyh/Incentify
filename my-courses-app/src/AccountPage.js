import React, { useState } from 'react';

const AccountPage = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    wallet: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Mi cuenta</h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:bg-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:bg-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:bg-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Wallet</label>
            <input
              type="text"
              name="wallet"
              value={userInfo.wallet}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:bg-gray-600"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-500 p-2 rounded-lg hover:bg-blue-400 transition duration-300">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
