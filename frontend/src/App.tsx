import { useState } from 'react'
import UserRegistration from './components/UserRegistration'
import UserLogin from './components/UserLogin'
import Navbar from './components/Navbar'

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Hero section */}
            <div className="px-4 py-6 sm:px-0 text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Bienvenido a</span>
                <span className="block text-primary-600">Challenge Puente</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Una plataforma moderna y segura para gestionar tus proyectos.
              </p>
            </div>

            {/* Auth forms */}
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">
                    {currentView === 'login' ? 'Iniciar Sesión' : 'Registrarse'}                    
                  </span>
                </div>
              </div>

              <div className="mt-6">
                {currentView === 'login' ? <UserLogin /> : <UserRegistration />}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 Challenge Puente. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
