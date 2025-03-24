import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, Award, ChevronRight } from "lucide-react"
import TorneoCard from "../components/TorneoCard"
import TestimonioCard from "../components/TestimonioCard"
import { api } from "../service/apiService"


const Home = () => {
  const [torneos, setTorneos] = useState([])
  const [testimonios, setTestimonios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 400))
        const torneosProximos = await api.torneo.getAllActivos();
        const testimoniosData = await api.testimonio.getAll();
  
        torneosProximos?.torneos?.length && setTorneos(torneosProximos?.torneos?.slice(0,6));
        testimoniosData?.testimonios?.length && setTestimonios(testimoniosData?.testimonios?.slice(0,6));
      } catch (error) {
        console.error("Error cargando datos:", error)
        setError("Hubo un problema al cargar los datos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Torneos Deportivos AquaSport</h1>
            <p className="text-xl md:text-2xl mb-8">
              Participa en los mejores eventos de natación, aguas abiertas, acuatlón, triatlón y atletismo
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/tournaments"
                className="block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Ver Torneos
              </Link>
              <Link
                to="/register"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Torneos Próximos Section */}
      <section className="py-12 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-blue-400" />
              Torneos Próximos
            </h2>
            <p className="mt-2 text-lg text-slate-300">No te pierdas los próximos eventos deportivos</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-4 bg-red-900/20 rounded-md">{error}</div>
          ) : torneos.length === 0 ? (
            <div className="text-center text-slate-400 p-4">No hay torneos próximos programados.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {torneos.map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/tournaments"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Más Torneos
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Award className="h-8 w-8 text-blue-400" />
              Testimonios
            </h2>
            <p className="mt-2 text-lg text-slate-300">Lo que dicen nuestros participantes</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-4 bg-red-900/20 rounded-md">{error}</div>
          ) : testimonios.length === 0 ? (
            <div className="text-center text-slate-400 p-4">No hay testimonios disponibles.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonios.map((testimonio, index) => (
                <TestimonioCard key={index} testimonio={testimonio} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Más Testimonios
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para competir?</h2>
          <p className="text-xl mb-8">Únete a nuestros torneos y demuestra tu talento en el agua o en la pista</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Registrarse Ahora
            </Link>            
          </div>
        </div>
      </section>
    </>
  )
}

export default Home

