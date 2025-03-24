import { useState, useEffect } from "react"
import ReactModal from "react-modal"
import { X, Save } from "lucide-react"
import Input from "./Input"
import { profileSchema } from "../utils/validations"
import toast from "react-hot-toast"
import { z } from "zod"
import { api } from "../service/apiService"
import { useAuth } from "../contexts/AuthProvider"



const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1e293b", // Dark background color
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #475569", // Darker border color
    maxWidth: "600px",
    width: "90%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent black overlay
    zIndex: 1000, // Ensure it's on top of everything
  },
}

const EditProfileModal = ({ onClose, isOpen }) => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    genero: "",
    edad: 0,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        genero: user.genero || "",
        edad: user.edad || 0,
      })
      // Limpiar errores al abrir el modal
      setErrors({})
    }
  }, [user, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "edad" ? Number(value) : value,
    }))
    // Limpiar error del campo cuando el usuario modifica
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar con Zod
      profileSchema.parse(formData)

      const resp = await api.usuario.updateProfile(user.id, formData, user.token);
      login({...user, ...formData});
      toast.success(resp.message);
      onClose()
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message, {position: 'bottom-right'})
        })
      } else {
        console.log(error?.response)
        toast.error(error?.response?.data?.message || "Error al actualizar el perfil", {position: 'bottom-right'})
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Editar Perfil"
      closeTimeoutMS={300}
    >
      <div className="flex justify-between items-center py-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="py-4 space-y-6">
        <Input
          label="Nombre completo"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
        />

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Género</label>
          <select
            id="genero"
            name="genero"
            className={`w-full px-4 py-2 bg-slate-800 border ${
              errors.genero ? "border-red-500" : "border-slate-700"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          {errors.genero && <p className="mt-1 text-sm text-red-500">{errors.genero}</p>}
        </div>

        <Input
          label="Edad"
          id="edad"
          name="edad"
          type="number"
          min="18"
          max="50"
          value={formData.edad}
          onChange={handleChange}
          error={errors.edad}
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer hover:bg-slate-700 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex text-sm items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <span className="animate-spin">⏳</span> : <Save className="h-4 w-4" />}
            Guardar cambios
          </button>
        </div>
      </form>
    </ReactModal>
  )
}

export default EditProfileModal

