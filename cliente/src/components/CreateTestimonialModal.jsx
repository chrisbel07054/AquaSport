import { useState } from "react"
import { motion } from "framer-motion"
import { X, Star, Send } from "lucide-react"

const CreateTestimonialModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    comentario: "",
    calificacion: 5,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      calificacion: rating,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.comentario.trim().length < 10) return;
    
    setIsLoading(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error al enviar testimonio:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Compartir mi experiencia</h2>
          <button onClick={onClose} className="text-slate-400 cursor-pointer hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">¿Cómo calificarías tu experiencia?</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className="focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= formData.calificacion ? "text-yellow-400 fill-current" : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comentario" className="block text-sm font-medium text-slate-300 mb-2">
              Tu comentario
            </label>
            <textarea
              id="comentario"
              name="comentario"
              rows="4"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Comparte tu experiencia en los torneos..."
              value={formData.comentario}
              onChange={handleChange}
              required
              minLength={10}
            ></textarea>
            <p className="mt-1 text-sm text-slate-400">Mínimo 10 caracteres. {formData.comentario.length} / 500</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer border border-slate-600 rounded-md text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || formData.comentario.trim().length < 10}
              className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publicar testimonio
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreateTestimonialModal

