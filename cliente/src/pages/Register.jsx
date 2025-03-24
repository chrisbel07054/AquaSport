import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { z } from "zod"
import toast from "react-hot-toast"
import { registerSchema } from "../utils/validations"
import Input from '../components/Input'
import { Mail, Lock, User, UserPlus } from "lucide-react"
import { api } from "../service/apiService"
import { useAuth } from "../contexts/AuthProvider"

const Register = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    genero: "",
    edad: 18,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edad' ? Number(value) : value,
    }))

    // Limpiar error del campo cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Validar formulario con Zod
      registerSchema.parse(formData)

      // Si pasa la validación, continuar con el envío
      setIsLoading(true)
      const response = await api.auth.register(formData)
      login(response.usuario)
      toast.success(response.message || "Registro exitoso. Ya puedes iniciar sesión.")
      navigate("/", { replace: true })
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message, {position: 'bottom-right'})
        })
      } else {
        console.log(error?.response)
        toast.error(error?.response?.data?.message || "Error en el registro", {position: 'bottom-right'})
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link to="/" className="flex items-center">
            <svg
              className="h-10 w-10 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <span className="ml-2 text-2xl font-bold text-white">AquaSport</span>
          </Link>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 text-center text-3xl font-extrabold text-white"
        >
          Crear una cuenta
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-2 text-center text-sm text-slate-400"
        >
          Regístrate para participar en nuestros torneos
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
                label="Nombre completo"
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
                icon={<User className="h-5 w-5 text-slate-400" />}
              />
            </div>

            <div>
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="h-5 w-5 text-slate-400" />}
              />
            </div>

            <div>
              <Input
                label="Contraseña"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="h-5 w-5 text-slate-400" />}
              />
            </div>

            <div>
              <Input
                label="Confirmar contraseña"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<Lock className="h-5 w-5 text-slate-400" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Género</label>
              <select
                id="genero"
                name="genero"
                className="w-full px-1 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
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

            <div>
              <Input
                label="Edad"
                id="edad"
                name="edad"
                type="number"
                min="18"
                max="50"
                required
                value={formData.edad}
                onChange={handleChange}
                error={errors.edad}
              />
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
                  <UserPlus className="h-5 w-5 mr-2" />
                )}
                {isLoading ? "Registrando..." : "Registrarse"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">¿Ya tienes una cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
