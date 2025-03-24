import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Trophy, Plus, Edit, X, Check } from 'lucide-react'
import { AnimatePresence } from "framer-motion"
import EditTournamentModal from "./EditTournamentModal"
import ConfirmStatusModal from "./ConfirmStatusModal"
import toast from "react-hot-toast"

// Función para capitalizar la primera letra
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Función para obtener el color según el deporte
const getDeporteColor = (deporte) => {
  switch (deporte) {
    case "natación":
      return "text-blue-400"
    case "aguas abiertas":
      return "text-cyan-400"
    case "acuatlón":
      return "text-sky-400"
    case "triatlón":
      return "text-green-400"
    case "atletismo":
      return "text-purple-400"
    default:
      return "text-slate-400"
  }
}

// Función para obtener el color según el estado
const getEstadoColor = (estado) => {
  switch (estado) {
    case "activo":
      return "bg-green-900/30 text-green-400 border-green-500"
    case "cancelado":
      return "bg-red-900/30 text-red-400 border-red-500"
    default:
      return "bg-slate-700/50 text-slate-400 border-slate-600"
  }
}

const GestionTorneos = ({ torneos, setTorneos }) => {
  const [selectedTorneo, setSelectedTorneo] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  const handleToggleTorneoEstado = (id) => {
    setTorneos((prevTorneos) =>
      prevTorneos.map((torneo) => {
        if (torneo.id === id) {
          const nuevoEstado = torneo.estado === "activo" ? "cancelado" : "activo"
          toast.success(`Torneo ${nuevoEstado === "activo" ? "activado" : "cancelado"} exitosamente`)
          return { ...torneo, estado: nuevoEstado }
        }
        return torneo
      }),
    )
  }

  const handleEditClick = (torneo) => {
    setSelectedTorneo(torneo)
    setShowEditModal(true)
  }

  const handleStatusClick = (torneo) => {
    setSelectedTorneo(torneo)
    setShowStatusModal(true)
  }

  const handleSaveTorneo = async (updatedTorneo) => {
    try {
      // Simulación de actualización
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTorneos((prevTorneos) => prevTorneos.map((t) => (t.id === selectedTorneo.id ? { ...t, ...updatedTorneo } : t)))

      toast.success("Torneo actualizado exitosamente")
      setShowEditModal(false)
    } catch (error) {
      console.error("Error al actualizar torneo:", error)
      toast.error("Error al actualizar el torneo")
    }
  }

  const handleConfirmStatus = async (torneoId) => {
    try {
      await handleToggleTorneoEstado(torneoId)
      setShowStatusModal(false)
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado del torneo")
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-8"
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-400" />
            Gestión de Torneos
          </h2>
          <Link
            to="/create-tournament"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Crear Torneo
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="max-h-[32rem] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Deporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Inscripciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {torneos.map((torneo) => (
                  <tr key={torneo.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{torneo.nombre}</div>
                      <div className="text-xs text-slate-400">{torneo.ubicacion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getDeporteColor(torneo.deporte)}`}>
                        {capitalize(torneo.deporte)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{new Date(torneo.fecha).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {torneo.inscritos} / {torneo.cupo}
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            (torneo.inscritos / torneo.cupo) >= 0.9
                              ? "bg-red-500"
                              : torneo.inscritos / torneo.cupo >= 0.7
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${(torneo.inscritos / torneo.cupo) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(torneo.estado)}`}>
                        {torneo.estado === "activo" ? "Activo" : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(torneo)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStatusClick(torneo)}
                          className={`${
                            torneo.estado === "activo"
                              ? "text-red-400 hover:text-red-300"
                              : "text-green-400 hover:text-green-300"
                          } transition-colors`}
                        >
                          {torneo.estado === "activo" ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Modales */}
      <AnimatePresence>
        {showEditModal && selectedTorneo && (
          <EditTournamentModal
            torneo={selectedTorneo}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveTorneo}
          />
        )}
        {showStatusModal && selectedTorneo && (
          <ConfirmStatusModal
            torneo={selectedTorneo}
            onClose={() => setShowStatusModal(false)}
            onConfirm={handleConfirmStatus}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default GestionTorneos
