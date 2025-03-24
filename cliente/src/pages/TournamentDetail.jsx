import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Clock,
  User
} from "lucide-react";
import InscriptionModal from "../components/InscriptionModal";
import { useAuth } from "../contexts/AuthProvider";
import { api } from "../service/apiService";

// Función para formatear la fecha
const formatearFecha = (fecha) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return new Date(fecha).toLocaleDateString("es-ES", options);
};

// Función para capitalizar la primera letra
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Función para obtener el color según el deporte
const getColor = (deporte) => {
  switch (deporte) {
    case "natación":
      return "text-blue-400 bg-blue-900/30 border-blue-500";
    case "aguas abiertas":
      return "text-cyan-400 bg-cyan-900/30 border-cyan-500";
    case "acuatlón":
      return "text-sky-400 bg-sky-900/30 border-sky-500";
    case "triatlón":
      return "text-green-400 bg-green-900/30 border-green-500";
    case "atletismo":
      return "text-purple-400 bg-purple-900/30 border-purple-500";
    default:
      return "text-slate-400 bg-slate-800/50 border-slate-600";
  }
};

const TournamentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [torneo, setTorneo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInscrito, setIsInscrito] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400))
      const response = await api.torneo.getById(id);

      if (response?.torneo) {
        setTorneo(response.torneo);

        //Verificar si el usuario está inscrito
        const findInscription = response.torneo.Inscripcions.some((p) => p.usuarioId === Number.parseInt(user.id));
        findInscription && setIsInscrito(true);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Hubo un problema al cargar los datos del torneo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchData();
  }, []);

  const handleInscripcion = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para inscribirte");
      return;
    }

    setShowModal(true);
  };

  const handleConfirmInscripcion = async () => {
    try {
      await api.torneo.inscribirse(id, user.id, user.token);
      await fetchData();
      setShowModal(false);
      toast.success("¡Te has inscrito exitosamente al torneo!");
    } catch (error) {
      console.error("Error al inscribirse:", error);
      toast.error(error?.response?.data?.message ||"Hubo un problema al procesar tu inscripción");
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto mb-4'></div>
          <p className='text-white'>Cargando información del torneo...</p>
        </div>
      </div>
    );
  }

  if (!torneo) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-6 bg-slate-800 rounded-lg shadow-lg'>
          <Trophy className='h-16 w-16 text-slate-600 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-white mb-2'>
            Torneo no encontrado
          </h2>
          <p className='text-slate-400 mb-6'>
            El torneo que estás buscando no existe o ha sido eliminado.
          </p>
          <Link
            to='/tournaments'
            className='inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'
          >
            <ArrowLeft className='h-5 w-5' />
            Volver a Torneos
          </Link>
        </div>
      </div>
    );
  }

  const colorClasses = getColor(torneo.deporte);

  return (
    <div className='bg-slate-900 min-h-screen py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Link
            to='/tournaments'
            className='flex items-center text-blue-400 hover:text-blue-300 transition-colors'
          >
            <ArrowLeft className='h-5 w-5 mr-2' />
            Volver a Torneos
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-slate-800 rounded-lg shadow-lg overflow-hidden'
        >
          {/* Cabecera del torneo */}
          <div className='p-6 border-b border-slate-700'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <h1 className='text-2xl md:text-3xl font-bold text-white'>
                {torneo.nombre}
              </h1>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${colorClasses} flex items-center gap-1`}
              >
                <Trophy className='h-4 w-4' />
                {capitalize(torneo.deporte)}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-semibold text-white mb-4'>
                  Detalles del evento
                </h2>
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <Calendar
                      className={`h-5 w-5 mr-3 mt-0.5 ${
                        colorClasses.split(" ")[0]
                      }`}
                    />
                    <div>
                      <p className='text-slate-300'>
                        {formatearFecha(torneo.fecha)}
                      </p>
                      <p className='text-sm text-slate-400'>
                        {new Date(torneo.fecha).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}{" "}
                        hrs
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <MapPin
                      className={`h-5 w-5 mr-3 mt-0.5 ${
                        colorClasses.split(" ")[0]
                      }`}
                    />
                    <div>
                      <p className='text-slate-300'>{torneo.ubicacion}</p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <Users
                      className={`h-5 w-5 mr-3 mt-0.5 ${
                        colorClasses.split(" ")[0]
                      }`}
                    />
                    <div>
                      <p className='text-slate-300'>
                        {torneo.cuposDisponibles > 0
                          ? `${torneo.cuposDisponibles} cupos disponibles de ${torneo.cupo}`
                          : "No hay cupos disponibles"}
                      </p>
                      <div className='w-full bg-slate-700 rounded-full h-2 mt-2'>
                        <div
                          className={`h-2 rounded-full ${
                            torneo.porcentajeOcupacion >= 90
                              ? "bg-red-500"
                              : torneo.porcentajeOcupacion >= 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${torneo.porcentajeOcupacion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <DollarSign
                      className={`h-5 w-5 mr-3 mt-0.5 ${
                        colorClasses.split(" ")[0]
                      }`}
                    />
                    <div>
                      <p className='text-slate-300'>
                        {torneo.precio > 0
                          ? `$${torneo.precio.toFixed(2)}`
                          : "Gratuito"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className='text-xl font-semibold text-white mb-4'>
                  Descripción
                </h2>
                <p className='text-slate-300 whitespace-pre-line'>
                  {torneo.descripcion}
                </p>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='bg-slate-700/50 rounded-lg p-6'>
                <h2 className='text-xl font-semibold text-white mb-4'>
                  Inscripción
                </h2>

                {isInscrito ? (
                  <div className='bg-green-900/30 border border-green-600 rounded-lg p-4 flex items-center'>
                    <CheckCircle className='h-6 w-6 text-green-500 mr-3' />
                    <div>
                      <p className='text-white font-medium'>
                        ¡Ya estás inscrito!
                      </p>
                      <p className='text-slate-300 text-sm'>
                        Estás registrado para participar en este torneo
                      </p>
                    </div>
                  </div>
                ) : torneo.cuposDisponibles <= 0 ? (
                  <div className='bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-center'>
                    <Clock className='h-6 w-6 text-red-500 mr-3' />
                    <div>
                      <p className='text-white font-medium'>Cupos agotados</p>
                      <p className='text-slate-300 text-sm'>
                        Lo sentimos, ya no hay cupos disponibles para este
                        torneo
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <p className='text-slate-300'>
                      Para participar en este torneo, completa tu inscripción:
                    </p>
                    <ul className='space-y-2 text-slate-400'>
                      <li className='flex items-start'>
                        <span className='inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-900 text-blue-300 text-xs mr-2 mt-0.5'>
                          1
                        </span>
                        <span>Regístrate o inicia sesión en la plataforma</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-900 text-blue-300 text-xs mr-2 mt-0.5'>
                          2
                        </span>
                        <span>Completa el formulario de inscripción</span>
                      </li>
                      <li className='flex items-start'>
                        <span className='inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-900 text-blue-300 text-xs mr-2 mt-0.5'>
                          3
                        </span>
                        <span>Realiza el pago correspondiente (si aplica)</span>
                      </li>
                    </ul>
                    <button
                      onClick={handleInscripcion}
                      className='w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2'
                    >
                      <User className='h-5 w-5' />
                      Inscribirme ahora
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h2 className='text-xl font-semibold text-white mb-4'>
                  Participantes inscritos
                </h2>
                <div className='bg-slate-700/50 rounded-lg p-4'>
                  <p className='text-slate-300 mb-2'>
                    Total: {torneo.inscripciones} de {torneo.cupo}
                  </p>
                  <ul className='space-y-2'>
                    {torneo?.Inscripcions &&
                      torneo.Inscripcions.map((participante) => (
                        <li
                          key={participante.id}
                          className='flex items-center p-2 hover:bg-slate-700 rounded-md transition-colors'
                        >
                          <div className='h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3'>
                            <User className='h-4 w-4' />
                          </div>
                          <div>
                            <p className='text-white'>{participante.Usuario.nombre}</p>
                            <p className='text-sm text-slate-400'>
                              Genero: {capitalize(participante.Usuario.genero)}
                            </p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de inscripción */}
      <AnimatePresence>
        {showModal && (
          <InscriptionModal
            torneo={torneo}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmInscripcion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentDetail;
