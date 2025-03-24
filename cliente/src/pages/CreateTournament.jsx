import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Input from "../components/Input"
import { Trophy } from "lucide-react"
import { torneoSchema } from "../utils/validations"
import { api } from "../service/apiService"
import { useAuth } from "../contexts/AuthProvider"
import { z } from "zod"


const CreateTournament = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    deporte: "",
    fecha: "",
    ubicacion: "",
    descripcion: "",
    cupo: "",
    precio: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cupo" || name === "precio" ? Number(value) : value,
    }))
    // Limpiar error cuando el usuario modifica el campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      torneoSchema.parse(formData)

      setIsLoading(true)
      await api.torneo.create(formData, user.token)

      toast.success("Torneo creado exitosamente")

      setTimeout(() => {
        navigate("/tournaments")
      }, 1500)
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message, {position: 'bottom-right'})
        })
      } else {
        console.log(error?.response)
        toast.error(error?.response?.data?.message || "Error al crear el torneo")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 text-center text-3xl font-extrabold text-white"
        >
          Crear Torneo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-2 text-center text-sm text-slate-400"
        >
          Crea un nuevo torneo para la comunidad
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Nombre del torneo"
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />
              {errors.nombre && <p className="mt-1 text-red-500 text-sm">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Deporte</label>
              <select
                id="deporte"
                name="deporte"
                className="w-full px-1 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
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
              {errors.deporte && <p className="mt-1 text-red-500 text-sm">{errors.deporte}</p>}
            </div>

            <div>
              <Input
                label="Fecha"
                id="fecha"
                name="fecha"
                type="date"
                required
                value={formData.fecha}
                onChange={handleChange}
                error={errors.fecha}
              />
              {errors.fecha && <p className="mt-1 text-red-500 text-sm">{errors.fecha}</p>}
            </div>

            <div>
              <Input
                label="Ubicación"
                id="ubicacion"
                name="ubicacion"
                type="text"
                required
                value={formData.ubicacion}
                onChange={handleChange}
                error={errors.ubicacion}
              />
              {errors.ubicacion && <p className="mt-1 text-red-500 text-sm">{errors.ubicacion}</p>}
            </div>

            <div>
              <Input
                label="Cupo máximo"
                id="cupo"
                name="cupo"
                type="number"
                min="1"
                required
                value={formData.cupo}
                onChange={handleChange}
                error={errors.cupo}
              />
              {errors.cupo && <p className="mt-1 text-red-500 text-sm">{errors.cupo}</p>}
            </div>

            <div>
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
              {errors.precio && <p className="mt-1 text-red-500 text-sm">{errors.precio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Descripción del torneo</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Describe los detalles del torneo..."
                value={formData.descripcion}
                onChange={handleChange}
                required
              ></textarea>
              {errors.descripcion && <p className="mt-1 text-red-500 text-sm">{errors.descripcion}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <Trophy className="h-5 w-5 mr-2" />
                )}
                {isLoading ? "Creando torneo..." : "Crear Torneo"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateTournament

