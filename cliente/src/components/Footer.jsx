import { Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300 hover:text-blue-400 transition-colors">
                <Phone className="h-5 w-5 mr-2 text-blue-400" />
                <span>+58 0416 456 7890</span>
              </li>
              <li className="flex items-center text-slate-300 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5 mr-2 text-blue-400" />
                <a href="mailto:info@aquasport.com">info@aquasport.com</a>
              </li>
              <li className="flex items-start text-slate-300">
                <MapPin className="h-5 w-5 mr-2 text-blue-400 mt-1" />
                <span>Av. Deportiva 123, Ciudad Deportiva | Lara</span>
              </li>
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Enlaces</h3>
            <ul className="grid grid-cols-2 gap-2">
              <li>
                <Link to="/login" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Registro
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Torneos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">
              &copy; {new Date().getFullYear()} AquaSport. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Luisiana Carreño
              </span>
              <span className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Chrisbel Briceño
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

