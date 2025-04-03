import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { User, Trophy, Calendar, MapPin, ArrowLeft, Medal } from "lucide-react"
import toast from "react-hot-toast"
import { api } from "../service/apiService"

const UserProfile = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        // Simulación de carga de datos desde una API
        await new Promise((resolve) => setTimeout(resolve, 600))
        const profile = await api.usuario.getUserById(id);
        console.log(profile)

        setUser({...profile.usuario, torneosGanados: profile.torneosGanados})
      } catch (error) {
        console.error("Error cargando datos del usuario:", error)
        toast.error("Hubo un problema al cargar el perfil del usuario")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  // Formatear fecha
  const formatDate = (dateString) => {
   // const options = { year: "numeric", month: "long", day: "numeric" }
    //return new Date(dateString).toLocaleDateString("es-ES", options)
    return new Date(dateString).toISOString().split("T")[0]
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 min-h-screen flex justify-center items-center">
        <div className="h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 bg-slate-800/50 rounded-lg">
            <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white">Usuario no encontrado</h3>
            <p className="text-slate-400 mt-2">El perfil que estás buscando no existe o ha sido eliminado</p>
            <Link to="/tournaments-history" className="mt-6 inline-flex items-center text-blue-400 hover:text-blue-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a torneos realizados
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-slate-900 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tournaments-history" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a torneos realizados
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800 rounded-lg overflow-hidden shadow-xl border border-slate-700"
        >
          {/* Cabecera del perfil */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white rounded-full p-2 w-24 h-24 flex items-center justify-center">
                <User className="h-16 w-16 text-blue-600" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{user.nombre}</h1>
                <p className="text-blue-200">{user.email}</p>
                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-blue-100">
                    {user.edad} años
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-blue-100">
                    {user.genero.charAt(0).toUpperCase() + user.genero.slice(1)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-blue-100">
                    Miembro desde {new Date(user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
              <div className="ml-auto hidden md:block">
                <div className="bg-yellow-500 text-yellow-900 rounded-full h-20 w-20 flex flex-col items-center justify-center">
                  <Trophy className="h-8 w-8" />
                  <span className="font-bold text-lg">{user.torneosGanados.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="p-6">
            <div className="md:hidden flex justify-center mb-6">
              <div className="bg-yellow-500 text-yellow-900 rounded-full h-20 w-20 flex flex-col items-center justify-center">
                <Trophy className="h-8 w-8" />
                <span className="font-bold text-lg">{user.torneosGanados.length}</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Medal className="h-5 w-5 text-yellow-400" />
              Torneos Ganados
            </h2>

            {user.torneosGanados.length === 0 ? (
              <div className="text-center py-10 bg-slate-700/30 rounded-lg">
                <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Este usuario aún no ha ganado ningún torneo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {user.torneosGanados.map((torneo) => (
                  <motion.div
                    key={torneo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white">{torneo.Torneo.nombre}</h3>
                        <div className="flex items-center mt-2 text-slate-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">{formatDate(torneo.Torneo.fecha)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-slate-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{torneo.Torneo.ubicacion}</span>
                        </div>
                      </div>
                      <div className="bg-blue-900 px-3 py-1 rounded-full text-xs font-medium text-blue-300">
                        {torneo.Torneo.deporte.charAt(0).toUpperCase() + torneo.Torneo.deporte.slice(1)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile

