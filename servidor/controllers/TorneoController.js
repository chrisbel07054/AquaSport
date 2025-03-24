const Torneo = require("../models/Torneo");
const Inscripcion = require("../models/Inscripcion");
const Usuario = require("../models/Usuario");
const {sequelize} = require("../config/database"); // Importamos la conexión
const { Op } = require("sequelize");

class TorneoController {
  async obtenerTorneosActivos(req, res) {
    try {
      const torneos = await Torneo.findAll({
        where: {
          estado: "activo",
          fecha: {
            [Op.gte]: new Date()
          }
        },
        order: [["fecha", "ASC"]]
      });

      return res.status(200).json({
        success: true,
        torneos
      });
    } catch (error) {
      console.error("Error en obtenerTorneos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los torneos",
        error: error.message
      });
    }
  }

  async obtenerTorneosConFiltros(req, res) {
    try {
      const { deporte, busqueda, estado } = req.query;
      const whereClause = {};

      if (deporte) {
        whereClause.deporte = deporte;
      }

      if (estado) {
        whereClause.estado = estado;
      } else {
        whereClause.estado = "activo";
      }

      if (busqueda) {
        whereClause.nombre = {
          [Op.like]: `%${busqueda}%`
        };
      }

      const torneos = await Torneo.findAll({
        where: whereClause,
        order: [["fecha", "ASC"]]
      });

      return res.status(200).json({
        success: true,
        torneos
      });
    } catch (error) {
      console.error("Error en obtenerTorneosConFiltros:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los torneos con filtros",
        error: error.message
      });
    }
  }

  async obtenerTorneoPorId(req, res) {
    try {
      const { id } = req.params;

      const torneo = await Torneo.findByPk(id, {
        include: [
          {
            model: Inscripcion,
            include: [
              {
                model: Usuario,
                attributes: ["id", "nombre", "genero", "edad"]
              }
            ]
          }
        ]
      });

      if (!torneo) {
        return res.status(404).json({
          success: false,
          message: "Torneo no encontrado"
        });
      }

      // Calcular cupos disponibles y porcentaje de ocupación
      const inscripciones = await Inscripcion.count({
        where: { torneoId: id }
      });

      const cuposDisponibles = torneo.cupo - inscripciones;
      const porcentajeOcupacion = ((inscripciones / torneo.cupo) * 100).toFixed(
        2
      );

      return res.status(200).json({
        success: true,
        torneo: {
          ...torneo.toJSON(),
          cuposDisponibles,
          porcentajeOcupacion,
          inscripciones
        }
      });
    } catch (error) {
      console.error("Error en obtenerTorneoPorId:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener el torneo",
        error: error.message
      });
    }
  }

  async crearTorneo(req, res) {
    try {
      const { nombre, deporte, fecha, ubicacion, descripcion, cupo, precio } =
        req.body;

      const nuevoTorneo = await Torneo.create({
        nombre,
        deporte,
        fecha,
        ubicacion,
        descripcion,
        cupo,
        precio,
        estado: "activo"
      });

      return res.status(201).json({
        success: true,
        message: "Torneo creado exitosamente",
        torneo: nuevoTorneo
      });
    } catch (error) {
      console.error("Error en crearTorneo:", error);
      return res.status(500).json({
        success: false,
        message: "Error al crear el torneo",
        error: error.message
      });
    }
  }

  async actualizarTorneo(req, res) {
    try {
      const { id } = req.params;
      const {
        nombre,
        deporte,
        fecha,
        ubicacion,
        descripcion,
        cupo,
        precio,
        estado
      } = req.body;

      const torneo = await Torneo.findByPk(id);
      if (!torneo) {
        return res.status(404).json({
          success: false,
          message: "Torneo no encontrado"
        });
      }

      // Actualizar torneo
      await torneo.update({
        nombre,
        deporte,
        fecha,
        ubicacion,
        descripcion,
        cupo,
        precio,
        estado
      });

      return res.status(200).json({
        success: true,
        message: "Torneo actualizado exitosamente",
        torneo
      });
    } catch (error) {
      console.error("Error en actualizarTorneo:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el torneo",
        error: error.message
      });
    }
  }

  async cambiarEstadoTorneo(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const torneo = await Torneo.findByPk(id);
      if (!torneo) {
        return res.status(404).json({
          success: false,
          message: "Torneo no encontrado"
        });
      }

      await torneo.update({ estado });

      return res.status(200).json({
        success: true,
        message: `Estado del torneo actualizado a ${estado}`,
        torneo
      });
    } catch (error) {
      console.error("Error en cambiarEstadoTorneo:", error);
      return res.status(500).json({
        success: false,
        message: "Error al cambiar el estado del torneo",
        error: error.message
      });
    }
  }

  async obtenerTorneosConInscritos(req, res) {
    try {
      const torneos = await Torneo.findAll(); 

      if (!torneos || torneos.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron torneos",
        });
      }
  
      const torneosConInscritos = await Promise.all(
        torneos.map(async (torneo) => {
          const inscritos = await Inscripcion.count({
            where: { torneoId: torneo.id }, 
          });
  
          return {
            ...torneo.dataValues,
            inscritos, // Incluye solo el número de inscritos
          };
        })
      );
  
      return res.status(200).json({
        success: true,
        torneos: torneosConInscritos,
      });
    } catch (error) {
      console.error("Error en obtenerTorneosConInscritos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los torneos",
        error: error.message,
      });
    }
  }
  

  async inscribirUsuario(req, res) {
    const transaction = await sequelize.transaction();
    const torneoId  = req.params.id;
    const usuarioId = req.body.usuarioId;
    try {

      // Verificar si el torneo existe
      const torneo = await Torneo.findByPk(torneoId, { transaction });
      if (!torneo) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Torneo no encontrado'
        });
      }

      // Verificar si el torneo está activo
      if (torneo.estado !== 'activo') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'No es posible inscribirse a un torneo cancelado'
        });
      }

      // Verificar si ya existe una inscripción
      const inscripcionExistente = await Inscripcion.findOne({
        where: { usuarioId, torneoId },
        transaction
      });

      if (inscripcionExistente) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Ya estás inscrito en este torneo'
        });
      }

      // Verificar disponibilidad de cupos
      const inscripciones = await Inscripcion.count({
        where: { torneoId },
        transaction
      });

      if (inscripciones >= torneo.cupo) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'No hay cupos disponibles para este torneo'
        });
      }

      // Crear la inscripción
      const nuevaInscripcion = await Inscripcion.create({
        usuarioId,
        torneoId
      }, { transaction });

      await transaction.commit();

      return res.status(201).json({
        success: true,
        message: 'Inscripción realizada exitosamente',
        inscripcion: nuevaInscripcion
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error en inscribirUsuario:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al realizar la inscripción',
        error: error.message
      });
    }
  }
}

module.exports = new TorneoController();
