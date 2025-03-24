import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { Award, MessageSquarePlus, Search } from "lucide-react"
import TestimonioCard from "../components/TestimonioCard"
import CreateTestimonialModal from "../components/CreateTestimonialModal"
import { api } from "../service/apiService"
import { useAuth } from "../contexts/AuthProvider"


const Testimonials = () => {
   const { user } = useAuth();
  const [testimonios, setTestimonios] = useState([])
  const [filteredTestimonios, setFilteredTestimonios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 400))
        const testimoniosData = await api.testimonio.getAll();
        if(testimoniosData?.testimonios?.length) {
          setTestimonios(testimoniosData?.testimonios);
          setFilteredTestimonios(testimoniosData?.testimonios)
        } 
      } catch (error) {
        console.error("Error cargando datos:", error)
        toast.error("Hubo un problema al cargar los testimonios")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar testimonios cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = testimonios.filter(
        (testimonio) =>
          testimonio?.Usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonio.comentario.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredTestimonios(filtered)
    } else {
      setFilteredTestimonios(testimonios)
    }
  }, [searchTerm, testimonios])

  const handleCreateTestimonial = async (newTestimonial) => {
    try {
      newTestimonial.usuarioId = Number(user.id);
      const response = await api.testimonio.create(newTestimonial, user.token)

      // Actualizar estado
      const updatedTestimonios = [response.testimonio, ...testimonios]
      setTestimonios(updatedTestimonios)
      setFilteredTestimonios(updatedTestimonios)

      setShowModal(false)
      toast.success("Testimonio publicado exitosamente")
    } catch (error) {
      console.error("Error al crear testimonio:", error)
      toast.error("Hubo un problema al publicar tu testimonio")
    }
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="bg-slate-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white flex items-center justify-center gap-2"
          >
            <Award className="h-10 w-10 text-blue-400" />
            Testimonios
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-2 text-lg text-slate-300"
          >
            Conoce las experiencias de nuestros participantes
          </motion.p>
        </div>

        {/* Búsqueda y botón de crear */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center"
        >
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar testimonios..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {user && user.rol !== 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <MessageSquarePlus className="h-5 w-5" />
              Compartir mi experiencia
            </button>
          )}
        </motion.div>

        {/* Lista de testimonios */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredTestimonios.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-lg">
            <Award className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white">No se encontraron testimonios</h3>
            <p className="text-slate-400 mt-2">
              {searchTerm ? "No hay testimonios que coincidan con tu búsqueda" : "Aún no hay testimonios disponibles"}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTestimonios.map((testimonio) => (
              <TestimonioCard key={testimonio.id} testimonio={testimonio} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal para crear testimonio */}
      <AnimatePresence>
        {showModal && <CreateTestimonialModal onClose={() => setShowModal(false)} onSubmit={handleCreateTestimonial} />}
      </AnimatePresence>
    </div>
  )
}

export default Testimonials

