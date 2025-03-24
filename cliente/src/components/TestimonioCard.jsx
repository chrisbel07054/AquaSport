import { Star, StarHalf, User } from "lucide-react"
import { motion } from "framer-motion"

const TestimonioCard = ({ testimonio }) => {
  const { Usuario, comentario, calificacion } = testimonio

  // Actualizar el renderizado de estrellas para usar colores nativos de Tailwind
  const renderEstrellas = (rating) => {
    const estrellas = []
    const totalEstrellas = 5

    for (let i = 1; i <= totalEstrellas; i++) {
      if (i <= rating) {
        // Estrella completa
        estrellas.push(
          <motion.div key={i} whileHover={{ scale: 1.2 }}>
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </motion.div>,
        )
      } else if (i - 0.5 === rating) {
        // Media estrella
        estrellas.push(
          <motion.div key={i} whileHover={{ scale: 1.2 }}>
            <StarHalf className="h-5 w-5 text-yellow-400 fill-current" />
          </motion.div>,
        )
      } else {
        // Estrella vacía
        estrellas.push(
          <motion.div key={i} whileHover={{ scale: 1.2 }}>
            <Star className="h-5 w-5 text-slate-600" />
          </motion.div>,
        )
      }
    }

    return estrellas
  }

  return (
    <motion.div
      className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors h-64 flex flex-col"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <motion.div
          className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white"
          whileHover={{ scale: 1.1}}
        >
          <User className="h-6 w-6" />
        </motion.div>
        <div className="ml-4">
          <h3 className="font-semibold text-lg text-text-primary">{Usuario?.nombre}</h3>
          <motion.div
            className="flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {renderEstrellas(calificacion)}
          </motion.div>
        </div>
      </div>
      <motion.p
        className="text-slate-300 flex-grow overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {comentario}
      </motion.p>
    </motion.div>
  )
}

export default TestimonioCard
