const Torneo = require('../models/Torneo');
const Inscripcion = require('../models/Inscripcion');
const {sequelize} = require('../config/database')

class InscripcionController {
    async inscribirUsuario(req, res) {
      const transaction = await sequelize.transaction();
      
      try {
        const { id: torneoId } = req.params;
        const usuarioId = req.usuario.id;
  
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
  
    async cancelarInscripcion(req, res) {
      try {
        const { id: torneoId } = req.params;
        const usuarioId = req.usuario.id;
  
        // Verificar si existe la inscripción
        const inscripcion = await Inscripcion.findOne({
          where: { usuarioId, torneoId }
        });
  
        if (!inscripcion) {
          return res.status(404).json({
            success: false,
            message: 'No estás inscrito en este torneo'
          });
        }
  
        // Eliminar la inscripción
        await inscripcion.destroy();
  
        return res.status(200).json({
          success: true,
          message: 'Inscripción cancelada exitosamente'
        });
      } catch (error) {
        console.error('Error en cancelarInscripcion:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al cancelar la inscripción',
          error: error.message
        });
      }
    }
  }
  
  module.exports = new InscripcionController();