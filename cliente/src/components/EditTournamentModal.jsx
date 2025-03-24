import { useState, useEffect } from "react"
import ReactModal from "react-modal"
import { X, Save } from "lucide-react"
import Input from "./Input"
import { torneoSchema } from "../utils/validations"
import toast from "react-hot-toast"


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
    maxWidth: "42rem",
    width: "100%",
    maxHeight: "90vh",
    border: "none",
    background: "rgb(30, 41, 59)", // bg-slate-800
    borderRadius: "0.5rem",
    padding: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
}

const EditTournamentModal = ({ torneo, onClose, onSave, isOpen }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    deporte: "",
    fecha: "",
    ubicacion: "",
    cupo: 0,
    precio: 0,
    descripcion: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Actualizar el formData cuando cambia el torneo seleccionado
  useEffect(() => {
    if (torneo && isOpen) {
      setFormData({
        nombre: torneo.nombre || "",
        deporte: torneo.deporte || "",
        fecha: new Date(torneo.fecha).toISOString().split('T')[0] || "",
        ubicacion: torneo.ubicacion || "",
        cupo: torneo.cupo || 0,
        precio: torneo.precio || 0,
        descripcion: torneo.descripcion || "",
      })
    }
  }, [torneo, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cupo" || name === "precio" ? Number(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      torneoSchema.parse(formData)
      await onSave({...formData, id: torneo.id})
      onClose()
      toast.success("Torneo actualizado exitosamente")
    } catch (error) {
      toast.error("Error al actualizar el torneo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Editar Torneo"
      closeTimeoutMS={300}
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Editar Torneo</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nombre del torneo"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Deporte</label>
            <select
              id="deporte"
              name="deporte"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white cursor-pointer"
              value={formData.deporte}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un deporte</option>
              <option value="natación">Natación</option>
              <option value="aguas abiertas">Aguas Abiertas</option>
              <option value="triatlón">Triatlón</option>
              <option value="acuatlón">Acuatlón</option>
              <option value="atletismo">Atletismo</option>
            </select>
            {errors.deporte && <p className="mt-1 text-sm text-red-500">{errors.deporte}</p>}
          </div>

          <Input
            label="Fecha"
            id="fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            error={errors.fecha}
            required
          />

          <Input
            label="Ubicación"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            error={errors.ubicacion}
            required
          />

          <Input
            label="Cupo máximo"
            id="cupo"
            name="cupo"
            type="number"
            min="1"
            value={formData.cupo}
            onChange={handleChange}
            error={errors.cupo}
            required
          />

          <Input
            label="Precio"
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={handleChange}
            error={errors.precio}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="4"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
            {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
          </div>
        </form>
      </div>

      <div className="flex justify-end gap-3 p-4 border-t border-slate-700 bg-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer hover:bg-slate-700 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? <span className="animate-spin">⏳</span> : <Save className="h-4 w-4" />}
          Guardar cambios
        </button>
      </div>
    </ReactModal>
  )
}

export default EditTournamentModal

