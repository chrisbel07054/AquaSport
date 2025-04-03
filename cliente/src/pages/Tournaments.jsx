import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Filter, Search, Plus } from "lucide-react";
import TorneoCard from "../components/TorneoCard";
import toast from "react-hot-toast";
import { api } from "../service/apiService";
import { useAuth } from "../contexts/AuthProvider";

const Tournaments = () => {
  const { user } = useAuth();
  const [torneos, setTorneos] = useState([]);
  const [filteredTorneos, setFilteredTorneos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeporte, setSelectedDeporte] = useState("");

  // Obtener lista de deportes únicos
  const deportes = [...new Set(torneos.map((torneo) => torneo.deporte))];

  useEffect(() => {
    // Simulación de carga de datos desde una API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));
        const torneosProximos = await api.torneo.getAllActivos();
        torneosProximos?.torneos?.length &&
          setTorneos(torneosProximos?.torneos);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Hubo un problema al cargar los torneos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar torneos cuando cambia el término de búsqueda o el deporte seleccionado
  useEffect(() => {
    let result = torneos;

    if (searchTerm) {
      result = result.filter(
        (torneo) =>
          torneo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          torneo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDeporte) {
      result = result.filter((torneo) => torneo.deporte === selectedDeporte);
    }

    setFilteredTorneos(result);
  }, [searchTerm, selectedDeporte, torneos]);

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-900 to-slate-900 min-h-screen py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-10'>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-4xl font-bold text-white flex items-center justify-center gap-2'
          >
            <Trophy className='h-10 w-10 text-blue-400' />
            Torneos Disponibles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='mt-2 text-lg text-slate-300'
          >
            Explora y participa en nuestros próximos eventos deportivos
          </motion.p>
        </div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 flex flex-col md:flex-row gap-4 justify-between items-center'
        >
          <div className='flex w-full md:w-auto gap-2 items-center'>
            <div className='relative w-full md:w-80'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-slate-400' />
              </div>
              <input
                type='text'
                placeholder='Buscar torneos...'
                className='w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link
              to='/tournaments-history'
              className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap'
            >
              <Trophy className='h-5 w-5' />
              <span className='hidden sm:inline'>Torneos Realizados</span>
              <span className='sm:hidden'>Realizados</span>
            </Link>
          </div>

          <div className='w-full md:w-auto flex flex-col md:flex-row gap-4'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Filter className='h-5 w-5 text-slate-400' />
              </div>
              <select
                className='w-full md:w-auto pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none'
                value={selectedDeporte}
                onChange={(e) => setSelectedDeporte(e.target.value)}
              >
                <option value=''>Todos los deportes</option>
                {deportes.map((deporte) => (
                  <option key={deporte} value={deporte}>
                    {deporte.charAt(0).toUpperCase() + deporte.slice(1)}
                  </option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <svg
                  className='h-5 w-5 text-slate-400'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>

            {user?.rol === "admin" && (
              <Link
                to='/create-tournament'
                className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'
              >
                <Plus className='h-5 w-5' />
                <span className='hidden sm:inline'>Crear Torneo</span>
                <span className='sm:hidden'>Crear</span>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Lista de torneos */}
        {isLoading ? (
          <div className='flex justify-center py-20'>
            <div className='h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin' />
          </div>
        ) : filteredTorneos.length === 0 ? (
          <div className='text-center py-20 bg-slate-800/50 rounded-lg'>
            <Trophy className='h-16 w-16 text-slate-600 mx-auto mb-4' />
            <h3 className='text-xl font-medium text-white'>
              No se encontraron torneos
            </h3>
            <p className='text-slate-400 mt-2'>
              {searchTerm || selectedDeporte
                ? "Intenta con otros filtros de búsqueda"
                : "No hay torneos disponibles en este momento"}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {filteredTorneos.map((torneo) => (
              <TorneoCard key={torneo.id} torneo={torneo} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
