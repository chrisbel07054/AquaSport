import ReactModal from "react-modal"
import { X, AlertTriangle } from "lucide-react"

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    maxWidth: "28rem",
    width: "100%",
    border: "none",
    background: "rgb(30, 41, 59)", // bg-slate-800
    borderRadius: "0.5rem",
    padding: 0,
    overflow: "hidden",
  },
}

const ConfirmStatusModal = ({ torneo, onClose, onConfirm, isOpen }) => {
  const isActivating = torneo.estado === "cancelado"

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={isActivating ? "Activar Torneo" : "Cancelar Torneo"}
      closeTimeoutMS={300}
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Confirmar acción</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-full ${isActivating ? "bg-green-900/30" : "bg-red-900/30"}`}>
            <AlertTriangle className={`h-6 w-6 ${isActivating ? "text-green-400" : "text-red-400"}`} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-1">
              {isActivating ? "Activar torneo" : "Cancelar torneo"}
            </h3>
            <p className="text-slate-400">
              {isActivating
                ? "¿Estás seguro de que deseas activar este torneo? Los participantes podrán inscribirse nuevamente."
                : "¿Estás seguro de que deseas cancelar este torneo? Se notificará a todos los participantes inscritos."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer hover:bg-slate-700 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(torneo.id, isActivating ? 'activo' : 'cancelado')}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer transition-colors ${
              isActivating ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isActivating ? "Sí, activar torneo" : "Sí, cancelar torneo"}
          </button>
        </div>
      </div>
    </ReactModal>
  )
}

export default ConfirmStatusModal

