import { useState } from 'react';

interface NavbarProps {
  currentView: 'login' | 'register';
  onViewChange: (view: 'login' | 'register') => void;
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/puente_logo.jfif"
                alt="Puente Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Challenge Puente
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:space-x-4 sm:items-center">
            <button
              onClick={() => onViewChange('login')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${currentView === 'login'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
                }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => onViewChange('register')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${currentView === 'register'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
                }`}
            >
              Registrarse
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono de menú */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icono de cerrar */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={() => {
              onViewChange('login');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-base font-medium transition-colors
              ${currentView === 'login'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
              }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              onViewChange('register');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-base font-medium transition-colors
              ${currentView === 'register'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
              }`}
          >
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
}
