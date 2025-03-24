import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { User, LogOut, Edit, Trophy, MessageSquare } from "lucide-react";
import TorneoCard from "../components/TorneoCard";
import TestimonioCard from "../components/TestimonioCard";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../contexts/AuthProvider"
import { api } from "../service/apiService"


const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [torneos, setTorneos] = useState(null);
  const [testimonios, setTestimonios] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 400))
        const response = await api.usuario.getTorneos(user.id, user.token);
        const data = await api.usuario.getTestimonios(user.id, user.token);
        if(response?.torneos?.length) {
          setTorneos(response.torneos)
        } 
        if(data?.testimonios?.length) {
          setTestimonios(data.testimonios)
        } 
      } catch (error) {
        console.error("Error cargando datos:", error)
        toast.error("Hubo un problema al cargar los torneos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])
  


  const handleEditProfile = () => {
    setShowEditModal(true);
  };


  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto mb-4'></div>
          <p className='text-white'>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-6 bg-slate-800 rounded-lg shadow-lg'>
          <User className='h-16 w-16 text-slate-600 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-white mb-2'>
            Usuario no encontrado
          </h2>
          <p className='text-slate-400 mb-6'>
            No se pudo cargar la información de tu perfil.
          </p>
          <Link
            to='/'
            className='inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-slate-900 min-h-screen py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Cabecera del dashboard */}
        <div className='mb-10'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-3xl font-bold text-white'
            >
              Mi Dashboard
            </motion.h1>
            <button
              onClick={logout}
              className='hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'
            >
              <LogOut className='h-5 w-5' />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Información del usuario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-8'
        >
          <div className='p-6 border-b border-slate-700'>
            <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
              <User className='h-5 w-5 text-blue-400' />
              Información Personal
            </h2>
          </div>
          <div className='p-6'>
            <div className='flex flex-col md:flex-row gap-6'>
              <div className='flex-shrink-0'>
                <div className='h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white'>
                  <User className='h-12 w-12' />
                </div>
              </div>
              <div className='flex-grow space-y-4'>
                <div>
                  <h3 className='text-2xl font-bold text-white'>
                    {user.nombre}
                  </h3>
                  <p className='text-slate-400'>{user.email}</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='bg-slate-700/50 rounded-lg p-4'>
                    <p className='text-sm text-slate-400'>Miembro desde</p>
                    <p className='text-white'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='bg-slate-700/50 rounded-lg p-4'>
                    <p className='text-sm text-slate-400'>Género</p>
                    <p className='text-white capitalize'>{user.genero}</p>
                  </div>
                  <div className='bg-slate-700/50 rounded-lg p-4'>
                    <p className='text-sm text-slate-400'>Edad</p>
                    <p className='text-white'>{user.edad} años</p>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <button
                    onClick={handleEditProfile}
                    className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer'
                  >
                    <Edit className='h-4 w-4' />
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mis Torneos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-8'
        >
          <div className='p-6 pb-2 lg:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
              <Trophy className='h-5 w-5 text-blue-400' />
              Mis Torneos
            </h2>
            <Link
              to='/tournaments'
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm w-full sm:w-auto justify-center sm:justify-start'
            >
              Ver todos los torneos
            </Link>
          </div>
          <div className='p-6 max-h-[38rem] lg:max-h-[20rem] overflow-y-auto'>
            {!torneos ? (
              <div className='text-center py-8'>
                <Trophy className='h-12 w-12 text-slate-600 mx-auto mb-4' />
                <h3 className='text-xl font-medium text-white mb-2'>
                  No estás inscrito en ningún torneo
                </h3>
                <p className='text-slate-400'>
                  Explora nuestros torneos disponibles y participa en los que
                  más te interesen.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {torneos.map((torneo) => (
                  <TorneoCard key={torneo.id} torneo={torneo} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Mis Testimonios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='border border-slate-700 rounded-lg shadow-lg overflow-hidden'
        >
          <div className='p-6 border-b border-slate-700'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                <Trophy className='h-5 w-5 text-blue-400' />
                Mis Testimonios
              </h2>
              <Link
                to='/testimonials'
                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm w-full sm:w-auto justify-center sm:justify-start'
              >
                <MessageSquare className='h-4 w-4' />
                Ver todos los testimonios
              </Link>
            </div>
          </div>
          <div className='max-h-[32rem] overflow-y-auto p-6'>
            {!testimonios ? (
              <div className='text-center py-8'>
                <MessageSquare className='h-12 w-12 text-slate-600 mx-auto mb-4' />
                <h3 className='text-xl font-medium text-white mb-2'>
                  No has publicado testimonios
                </h3>
                <p className='text-slate-400'>
                  Comparte tu experiencia en los torneos para ayudar a otros
                  participantes.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {testimonios.map((testimonio) => (
                  <TestimonioCard key={testimonio.id} testimonio={testimonio} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal de edición de perfil */}
      <EditProfileModal
        onClose={() => setShowEditModal(false)}
        isOpen={showEditModal}
      />
    </div>
  );
};

export default UserDashboard;
