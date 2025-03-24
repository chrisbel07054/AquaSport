import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthProvider"

const Navbar = () => {
  const navigate = useNavigate ()
  const { user, logout } = useAuth();
  const isAdmin = user && user.rol === 'admin';
  const [isOpen, setIsOpen] = useState(false)


  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    navigate("/", { replace: true })
    logout();
  }


  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              <span className="ml-2 text-xl font-bold">AquaSport</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
              Inicio
            </Link>
            <Link
              to="/tournaments"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Torneos
            </Link>
            <Link
              to="/testimonials"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Testimonios
            </Link>

            {user && !isAdmin && (
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Mi Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-md text-sm font-medium bg-cyan-600 hover:bg-cyan-700 transition-colors"
              >
                Admin
              </Link>
            )}

            {user ? (
              <button
                className="px-3 py-2 cursor-pointer rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-slate-700 focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors"
              onClick={toggleMenu}
            >
              Inicio
            </Link>
            <Link
              to="/tournaments"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors"
              onClick={toggleMenu}
            >
              Torneos
            </Link>
            <Link
              to="/testimonials"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors"
              onClick={toggleMenu}
            >
              Testimonios
            </Link>

            {user && !isAdmin && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors"
                onClick={toggleMenu}
              >
                Mi Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium bg-cyan-600 hover:bg-cyan-700 transition-colors"
                onClick={toggleMenu}
              >
                Admin
              </Link>
            )}

            {user ? (
              <button
                className="w-full cursor-pointer text-left px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors flex items-center"
                onClick={() => {
                  handleLogout()
                  toggleMenu()
                }}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={toggleMenu}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

