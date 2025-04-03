"use client"

import { useState, useEffect } from "react"
import ReactModal from "react-modal"
import { X, Trophy, Search, User } from "lucide-react"

// Estilos para ReactModal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1e293b", // bg-slate-800
    border: "1px solid #334155", // border-slate-700
    borderRadius: "0.5rem",
    padding: 0,
    maxWidth: "32rem",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 50,
  },
}

// Asegurarse de que ReactModal esté accesible
ReactModal.setAppElement("#root")

const FinalizeTournamentModal = ({ isOpen, onClose, torneo, usuarios, onFinalize }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [filteredUsuarios, setFilteredUsuarios] = useState([])

  useEffect(() => {
    if (usuarios) {
      setFilteredUsuarios(
        usuarios.filter(
          (usuario) =>
            usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [searchTerm, usuarios])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedUserId) {
      onFinalize(torneo.id, selectedUserId)
      onClose()
    }
  }

  // Resetear el estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedUserId(null)
    }
  }, [isOpen])

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Finalizar Torneo">
      <div className="border-b border-slate-700">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Finalizar Torneo
          </h3>
          <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-white font-medium mb-2">Detalles del torneo</h4>
          <div className="bg-slate-700/30 p-3 rounded-md">
            <p className="text-white font-medium">{torneo.nombre}</p>
            <p className="text-sm text-slate-300">
              {new Date(torneo.fecha).toLocaleDateString()} | {torneo.ubicacion}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-white font-medium mb-2">Seleccionar ganador</h4>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar participante..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto bg-slate-700/30 rounded-md">
            {filteredUsuarios.length === 0 ? (
              <div className="p-4 text-center text-slate-400">No se encontraron participantes</div>
            ) : (
              <div className="divide-y divide-slate-700">
                {filteredUsuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className={`p-3 flex items-center cursor-pointer transition-colors ${
                      selectedUserId === usuario.id
                        ? "bg-blue-900/30 border-l-4 border-blue-500"
                        : "hover:bg-slate-700/50"
                    }`}
                    onClick={() => setSelectedUserId(usuario.id)}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{usuario.nombre}</p>
                      <p className="text-xs text-slate-400">{usuario.email}</p>
                    </div>
                    {selectedUserId === usuario.id && <Trophy className="h-5 w-5 text-yellow-400 ml-auto" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedUserId}
            className={`px-4 py-2 cursor-pointer rounded-md transition-colors flex items-center gap-2 ${
              selectedUserId
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Trophy className="h-4 w-4" />
            Guardar Ganador
          </button>
        </div>
      </div>
    </ReactModal>
  )
}

export default FinalizeTournamentModal

