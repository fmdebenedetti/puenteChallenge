import React, { useState } from 'react';
import Popup from './Popup';

interface LoginData {
  email: string;
  password: string;
}

interface UserLoginProps {
  onLoginSuccess: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [popup, setPopup] = useState<{ message: string; type: 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          onLoginSuccess();
        } else {
          setPopup({ message: 'No se recibió el token de autenticación. Contacte al administrador.', type: 'error' });
        }
      } else {
        const data = await response.json().catch(() => ({}));
        setPopup({ message: data.message || 'Error en el inicio de sesión', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setPopup({ message: 'Error al conectar con el servidor', type: 'error' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      {popup && (
        <Popup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />
      )}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
