import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Trophy, Search, Award, Calendar, MapPin } from "lucide-react"
import toast from "react-hot-toast"
import { api } from "../service/apiService"

const TournamentsHistory = () => {
  const [torneos, setTorneos] = useState([])
  const [filteredTorneos, setFilteredTorneos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 400))
        const torneosFinalizadoss = await api.torneo.getAllFinalizados();
        console.log(torneosFinalizadoss)
        if(torneosFinalizadoss.torneos.length) {
          setTorneos(torneosFinalizadoss.torneos.map(torneo => ({...torneo.Torneo, ganador: torneo.Usuario})))
        }
      } catch (error) {
        console.error("Error cargando datos:", error)
        toast.error("Hubo un problema al cargar los torneos finalizados")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

 
  useEffect(() => {
    let result = torneos

    if (searchTerm) {
      result = result.filter(
        (torneo) =>
          torneo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          torneo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          torneo.ganador.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredTorneos(result)
  }, [searchTerm, torneos])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-slate-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white flex items-center justify-center gap-2"
          >
            <Trophy className="h-10 w-10 text-yellow-400" />
            Torneos Realizados
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-2 text-lg text-slate-300"
          >
            Historial de eventos deportivos organizados por AquaSport
          </motion.p>
        </div>

        {/* Búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-full max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, ubicación o ganador..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Lista de torneos finalizados */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredTorneos.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-lg">
            <Trophy className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white">No se encontraron torneos finalizados</h3>
            <p className="text-slate-400 mt-2">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "No hay torneos finalizados en el historial"}
            </p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {filteredTorneos.map((torneo) => (
              <motion.div
                key={torneo.id}
                variants={itemVariants}
                className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-blue-500 transition-colors"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{torneo.nombre}</h3>
                      <div className="flex items-center mt-2 text-slate-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{formatDate(torneo.fecha)}</span>
                      </div>
                      <div className="flex items-center mt-1 text-slate-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{torneo.ubicacion}</span>
                      </div>
                      <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                        {torneo.deporte.charAt(0).toUpperCase() + torneo.deporte.slice(1)}
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg w-full md:w-auto">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Award className="h-5 w-5" />
                        <span className="font-semibold">Ganador</span>
                      </div>
                      <div className="text-white font-medium">{torneo.ganador.nombre}</div>
                      <div className="text-sm text-slate-400 mt-1">
                        {torneo.ganador.edad} años |{" "}
                        {torneo.ganador.genero.charAt(0).toUpperCase() + torneo.ganador.genero.slice(1)}
                      </div>
                      <Link
                        to={`/user-profile/${torneo.ganador.id}`}
                        className="mt-3 inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                      >
                        Ver perfil
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TournamentsHistory

