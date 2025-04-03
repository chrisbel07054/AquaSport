import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  User,
  LogOut,
  Users,
  Trophy,
  MessageSquare,
  Plus,
  Edit,
  X,
  Check,
  Star,
  Award
} from "lucide-react";
import EditTournamentModal from "../components/EditTournamentModal";
import ConfirmStatusModal from "../components/ConfirmStatusModal";
import { api } from "../service/apiService";
import { useAuth } from "../contexts/AuthProvider";
import FinalizeTournamentModal from "../components/FinalizeTournamentModal";

// Función para capitalizar la primera letra
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Función para obtener el color según el deporte
const getDeporteColor = (deporte) => {
  switch (deporte) {
    case "natación":
      return "text-blue-400";
    case "aguas abiertas":
      return "text-cyan-400";
    case "acuatlón":
      return "text-sky-400";
    case "triatlón":
      return "text-green-400";
    case "atletismo":
      return "text-purple-400";
    default:
      return "text-slate-400";
  }
};

// Función para obtener el color según el estado
const getEstadoColor = (estado) => {
  switch (estado) {
    case "activo":
      return "bg-green-900/30 text-green-400 border-green-500";
    case "cancelado":
      return "bg-red-900/30 text-red-400 border-red-500";
    default:
      return "bg-blue-900/30 text-blue-400 border-slate-600";
  }
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [torneos, setTorneos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulamos un retraso para mostrar el estado de carga
        await new Promise((resolve) => setTimeout(resolve, 400));
        const resp = await api.torneo.getAll(user.token);
        const users = await api.usuario.getAllUsuarios(user.token);
        const testimonials = await api.testimonio.getAll();
        setTorneos(resp.torneos);
        setUsuarios(users.usuarios);
        setTestimonios(testimonials.testimonios);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Hubo un problema al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleTorneoEstado = (id) => {
    setTorneos((prevTorneos) =>
      prevTorneos.map((torneo) => {
        if (torneo.id === id) {
          const nuevoEstado =
            torneo.estado === "activo" ? "cancelado" : "activo";
          toast.success(
            `Torneo ${
              nuevoEstado === "activo" ? "activado" : "cancelado"
            } exitosamente`
          );
          return { ...torneo, estado: nuevoEstado };
        }
        return torneo;
      })
    );
  };

  const handleEditClick = (torneo) => {
    setSelectedTorneo(torneo);
    setShowEditModal(true);
  };

  const handleStatusClick = (torneo) => {
    setSelectedTorneo(torneo);
    setShowStatusModal(true);
  };

  const handleSaveTorneo = async (updatedTorneo) => {
    try {
      await api.torneo.updateTorneo(
        updatedTorneo.id,
        updatedTorneo,
        user.token
      );
      setTorneos((prevTorneos) =>
        prevTorneos.map((t) =>
          t.id === selectedTorneo.id ? { ...t, ...updatedTorneo } : t
        )
      );
    } catch (error) {
      console.error("Error al actualizar torneo:", error);
      toast.error("Error al actualizar el torneo");
    }
  };

  const handleConfirmStatus = async (torneoId, estado) => {
    try {
      await api.torneo.changeStatus(torneoId, { estado }, user.token);
      handleToggleTorneoEstado(torneoId);
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado del torneo");
    }
  };

  const handleFinalizeClick = (torneo) => {
    setSelectedTorneo(torneo);
    setShowFinalizeModal(true);
  };

  const handleFinalizeTorneo = async (torneoId, ganadorId) => {
    try {
      await api.torneo.changeStatus(
        torneoId,
        { estado: "finalizado", usuarioId: ganadorId },
        user.token
      );
      setTorneos((prevTorneos) =>
        prevTorneos.map((torneo) => {
          if (torneo.id === torneoId) {
            toast.success(`Torneo finalizado exitosamente`);
            return { ...torneo, estado: "finalizado", ganadorId };
          }
          return torneo;
        })
      );
    } catch (error) {
      console.error("Error al finalizar torneo:", error);
      toast.error("Error al finalizar el torneo");
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto mb-4'></div>
          <p className='text-white'>Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const totalTorneos = torneos.length;
  const torneosActivos = torneos.filter((t) => t.estado === "activo").length;
  const torneosCancelados = torneos.filter(
    (t) => t.estado === "cancelado"
  ).length;
  const totalUsuarios = usuarios.length;
  const totalTestimonios = testimonios.length;
  const totalInscritos = torneos.reduce(
    (sum, torneo) => sum + torneo.inscritos,
    0
  );

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
              Panel de Administración
            </motion.h1>
            <button
              onClick={logout}
              className='hidden cursor-pointer md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'
            >
              <LogOut className='h-5 w-5' />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
        >
          <div className='bg-slate-800 rounded-lg p-6 shadow-lg'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-full bg-blue-900/50 flex items-center justify-center'>
                <Trophy className='h-6 w-6 text-blue-400' />
              </div>
              <div>
                <p className='text-slate-400 text-sm'>Total Torneos</p>
                <h3 className='text-2xl font-bold text-white'>
                  {totalTorneos}
                </h3>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-xs text-green-400'>
                    {torneosActivos} activos
                  </span>
                  <span className='text-xs text-slate-400'>•</span>
                  <span className='text-xs text-red-400'>
                    {torneosCancelados} cancelados
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-slate-800 rounded-lg p-6 shadow-lg'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-full bg-cyan-900/50 flex items-center justify-center'>
                <Users className='h-6 w-6 text-cyan-400' />
              </div>
              <div>
                <p className='text-slate-400 text-sm'>Usuarios Registrados</p>
                <h3 className='text-2xl font-bold text-white'>
                  {totalUsuarios}
                </h3>
              </div>
            </div>
          </div>

          <div className='bg-slate-800 rounded-lg p-6 shadow-lg'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-full bg-green-900/50 flex items-center justify-center'>
                <User className='h-6 w-6 text-green-400' />
              </div>
              <div>
                <p className='text-slate-400 text-sm'>Total Inscripciones</p>
                <h3 className='text-2xl font-bold text-white'>
                  {totalInscritos}
                </h3>
              </div>
            </div>
          </div>

          <div className='bg-slate-800 rounded-lg p-6 shadow-lg'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-full bg-purple-900/50 flex items-center justify-center'>
                <MessageSquare className='h-6 w-6 text-purple-400' />
              </div>
              <div>
                <p className='text-slate-400 text-sm'>Testimonios</p>
                <h3 className='text-2xl font-bold text-white'>
                  {totalTestimonios}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gestión de torneos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-8'
        >
          <div className='p-6 border-b border-slate-700'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                <Trophy className='h-5 w-5 text-blue-400' />
                Gestión de Torneos
              </h2>
              <Link
                to='/create-tournament'
                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm w-full sm:w-auto justify-center sm:justify-start'
              >
                <Plus className='h-4 w-4' />
                Crear Torneo
              </Link>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <div className='max-h-[32rem] overflow-y-auto'>
              <table className='w-full'>
                <thead className='bg-slate-700 sticky top-0 z-10'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Nombre
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Deporte
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Fecha
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Inscripciones
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Estado
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-700'>
                  {torneos.map((torneo) => (
                    <tr
                      key={torneo.id}
                      className='hover:bg-slate-700/30 transition-colors'
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-white'>
                          {torneo.nombre}
                        </div>
                        <div className='text-xs text-slate-400'>
                          {torneo.ubicacion}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`text-sm ${getDeporteColor(
                            torneo.deporte
                          )}`}
                        >
                          {capitalize(torneo.deporte)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-slate-300'>
                          {new Date(torneo.fecha).toISOString().split("T")[0]}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-slate-300'>
                          {torneo.inscritos} / {torneo.cupo}
                        </div>
                        <div className='w-full bg-slate-700 rounded-full h-1.5 mt-1'>
                          <div
                            className={`h-1.5 rounded-full ${
                              torneo.inscritos / torneo.cupo >= 0.9
                                ? "bg-red-500"
                                : torneo.inscritos / torneo.cupo >= 0.7
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${
                                (torneo.inscritos / torneo.cupo) * 100
                              }%`
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(
                            torneo.estado
                          )}`}
                        >
                          {torneo.estado === "activo"
                            ? "Activo"
                            : torneo.estado === "finalizado"
                            ? "Finalizado"
                            : "Cancelado"}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex justify-end gap-2'>
                          {torneo.estado !== "finalizado" ? (
                            <button
                              onClick={() => handleEditClick(torneo)}
                              className='text-blue-400 cursor-pointer hover:text-blue-300 transition-colors'
                              title='Editar torneo'
                            >
                              <Edit className='h-5 w-5' />
                            </button>
                          ) : (
                            "- - - - - - - - -"
                          )}

                          {torneo.estado === "activo" && (
                            <button
                              onClick={() => handleFinalizeClick(torneo)}
                              className='text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors'
                              title='Finalizar torneo y seleccionar ganador'
                            >
                              <Award className='h-5 w-5' />
                            </button>
                          )}

                          {torneo.estado !== "finalizado" && (
                            <button
                              onClick={() => handleStatusClick(torneo)}
                              className={`${
                                torneo.estado === "activo"
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-green-400 hover:text-green-300"
                              } transition-colors cursor-pointer`}
                              title={
                                torneo.estado === "activo"
                                  ? "Cancelar torneo"
                                  : "Activar torneo"
                              }
                            >
                              {torneo.estado === "activo" ? (
                                <X className='h-5 w-5' />
                              ) : (
                                <Check className='h-5 w-5' />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Usuarios registrados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-8'
        >
          <div className='p-6 border-b border-slate-700'>
            <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
              <Users className='h-5 w-5 text-cyan-400' />
              Usuarios Registrados
            </h2>
          </div>
          <div className='overflow-x-auto'>
            <div className='max-h-96 overflow-y-auto'>
              <table className='w-full'>
                <thead className='bg-slate-700 sticky top-0'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Usuario
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Género
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Edad
                    </th>
                    <th className='px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider'>
                      Fecha de registro
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-700'>
                  {usuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className='hover:bg-slate-700/30 transition-colors'
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3'>
                            <User className='h-4 w-4' />
                          </div>
                          <div className='text-sm font-medium text-white hover:text-blue-400'>
                            <Link to={`/user-profile/${usuario.id}`}>
                              {usuario.nombre}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-slate-300'>
                          {usuario.email}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-slate-300 capitalize'>
                          {usuario.genero}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-slate-300'>
                          {usuario.edad} años
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center'>
                        <div className='text-sm text-slate-300'>
                          {
                            new Date(usuario.createdAt)
                              .toISOString()
                              .split("T")[0]
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Testimonios recientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className='bg-slate-800 rounded-lg shadow-lg overflow-hidden'
        >
          <div className='p-6 border-b border-slate-700'>
            <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
              <MessageSquare className='h-5 w-5 text-purple-400' />
              Testimonios Recientes
            </h2>
          </div>
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            {testimonios.slice(0, 6).map((testimonio) => (
              <div
                key={testimonio.id}
                className='bg-slate-700/30 rounded-lg p-4'
              >
                <div className='flex items-center mb-2'>
                  <div className='h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3'>
                    <User className='h-4 w-4' />
                  </div>
                  <div>
                    <div className='text-sm font-medium text-white'>
                      {testimonio.Usuario.nombre}
                    </div>
                    <div className='text-xs text-slate-400'>
                      {testimonio.createdAt
                        ? new Date(testimonio.createdAt)
                            .toISOString()
                            .split("T")[0]
                        : new Date().toISOString().split("T")[0]}
                    </div>
                  </div>
                </div>
                <p className='text-sm text-slate-300 line-clamp-3'>
                  {testimonio.comentario}
                </p>
                <div className='mt-2 flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonio.calificacion
                          ? "text-yellow-400 fill-current"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='p-4 border-t border-slate-700 text-center'>
            <Link
              to='/testimonials'
              className='text-blue-400 hover:text-blue-400/80 text-sm'
            >
              Ver todos los testimonios
            </Link>
          </div>
        </motion.div>

        {/* Modales */}
        <EditTournamentModal
          torneo={selectedTorneo || {}}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveTorneo}
          isOpen={showEditModal && selectedTorneo !== null}
        />

        <ConfirmStatusModal
          torneo={selectedTorneo || {}}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleConfirmStatus}
          isOpen={showStatusModal && selectedTorneo !== null}
        />

        <FinalizeTournamentModal
          torneo={selectedTorneo || {}}
          usuarios={usuarios}
          onClose={() => setShowFinalizeModal(false)}
          onFinalize={handleFinalizeTorneo}
          isOpen={showFinalizeModal && selectedTorneo !== null}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
