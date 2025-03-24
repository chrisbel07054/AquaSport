const {sequelize} = require("../config/database"); // Importamos la conexión
const Torneo = require('../models/Torneo');
const Inscripcion = require('../models/Inscripcion');
const Usuario = require('../models/Usuario');
const Testimonio = require('../models/Testimonio');
const { Op } = require('sequelize');

class AdminController {
  async obtenerEstadisticas(req, res) {
    try {
      // Total de usuarios
      const totalUsuarios = await Usuario.count();
      
      // Total de torneos
      const totalTorneos = await Torneo.count();
      
      // Total de inscripciones
      const totalInscripciones = await Inscripcion.count();
      
      // Torneos por deporte
      const torneosPorDeporte = await Torneo.findAll({
        attributes: [
          'deporte',
          [sequelize.fn('count', sequelize.col('id')), 'total']
        ],
        group: ['deporte']
      });
      
      // Inscripciones por género
      const inscripcionesPorGenero = await Inscripcion.findAll({
        attributes: [
          [sequelize.literal('Usuario.genero'), 'genero'],
          [sequelize.fn('count', sequelize.col('Inscripcion.id')), 'total']
        ],
        include: [{
          model: Usuario,
          attributes: []
        }],
        group: ['Usuario.genero'],
        raw: true
      });
      
      // Torneos próximos
      const torneosProximos = await Torneo.count({
        where: {
          fecha: {
            [Op.gt]: new Date()
          },
          estado: 'activo'
        }
      });
      
      // Torneos pasados
      const torneosPasados = await Torneo.count({
        where: {
          fecha: {
            [Op.lt]: new Date()
          }
        }
      });
      
      // Calificación promedio de testimonios
      const calificacionPromedio = await Testimonio.findOne({
        attributes: [
          [sequelize.fn('avg', sequelize.col('calificacion')), 'promedio']
        ],
        raw: true
      });

      return res.status(200).json({
        success: true,
        estadisticas: {
          totalUsuarios,
          totalTorneos,
          totalInscripciones,
          torneosPorDeporte,
          inscripcionesPorGenero,
          torneosProximos,
          torneosPasados,
          calificacionPromedio: calificacionPromedio.promedio || 0
        }
      });
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las estadísticas',
        error: error.message
      });
    }
  }

  async obtenerTodosLosUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        usuarios
      });
    } catch (error) {
      console.error('Error en obtenerTodosLosUsuarios:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener todos los usuarios',
        error: error.message
      });
    }
  }

  async obtenerTodosLosTestimonios(req, res) {
    try {
      const testimonios = await Testimonio.findAll({
        include: [{
          model: Usuario,
          attributes: ['id', 'nombre', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        testimonios
      });
    } catch (error) {
      console.error('Error en obtenerTodosLosTestimonios:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener todos los testimonios',
        error: error.message
      });
    }
  }
}

module.exports = new AdminController();