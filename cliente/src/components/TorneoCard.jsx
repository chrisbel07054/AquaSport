import { Calendar, MapPin, Trophy, X, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

// Función para capitalizar la primera letra
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Función para obtener el color de fondo según el deporte
const getBgColor = (deporte) => {
  switch (deporte) {
    case "natación":
      return "bg-blue-900/30 border-blue-500"
    case "aguas abiertas":
      return "bg-cyan-900/30 border-cyan-500"
    case "acuatlón":
      return "bg-sky-900/30 border-sky-500"
    case "triatlón":
      return "bg-green-900/30 border-green-500"
    case "atletismo":
      return "bg-purple-900/30 border-purple-500"
    default:
      return "bg-slate-800/50 border-slate-600"
  }
}

// Función para obtener el color del texto según el deporte
const getTextColor = (deporte) => {
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

// Función para formatear la fecha
const formatearFecha = (fecha) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(fecha).toLocaleDateString("es-ES", options)
}

const TorneoCard = ({ torneo }) => {
  const { id, nombre, deporte, fecha, ubicacion, estado = "activo" } = torneo
  const bgColor = getBgColor(deporte)
  const textColor = getTextColor(deporte)

  // Calcular días restantes
  const diasRestantes = () => {
    const hoy = new Date()
    const fechaTorneo = new Date(fecha)
    const diferencia = fechaTorneo - hoy
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24))

    if (dias === 0) return "Hoy"
    if (dias === 1) return "Mañana"
    return `En ${dias} días`
  }

  return (
    <motion.div
      className={`rounded-lg overflow-hidden border-l-4 ${bgColor} bg-slate-900 min-h-[16rem] flex flex-col`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex flex-col gap-3 mb-4">
          <h3 className="font-bold text-xl text-white mb-auto">{nombre}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${textColor} ${bgColor} flex items-center gap-1 text-xs w-fit`}
            >
              <Trophy className="h-4 w-4 flex-shrink-0" />
              {capitalize(deporte)}
            </span>

            {estado === "cancelado" && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-500 flex items-center gap-1 w-fit">
                <X className="h-3 w-3 flex-shrink-0" />
                Cancelado
              </span>
            )}

            {estado === "activo" && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500 flex items-center gap-1 w-fit">
                <Check className="h-3 w-3 flex-shrink-0" />
                Activo
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 flex-grow">
          <div className="flex items-center text-slate-300">
            <Calendar className={`h-5 w-5 mr-2 flex-shrink-0 ${textColor}`} />
            <span className="line-clamp-1">{formatearFecha(fecha)}</span>
          </div>

          <div className="flex items-center text-slate-300">
            <MapPin className={`h-5 w-5 mr-2 flex-shrink-0 ${textColor}`} />
            <span className="line-clamp-1">{ubicacion}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className={`font-semibold ${textColor} whitespace-nowrap`}>{diasRestantes()}</span>
          <Link
            to={`/tournaments/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default TorneoCard

