const Usuario = require('../models/Usuario');
const Testimonio = require('../models/Testimonio');

class TestimonioController {
    async obtenerTestimonios(req, res) {
      try {
        const testimonios = await Testimonio.findAll({
          include: [{
            model: Usuario,
            attributes: ['id', 'nombre']
          }],
          order: [['createdAt', 'DESC']]
        });
  
        return res.status(200).json({
          success: true,
          testimonios
        });
      } catch (error) {
        console.error('Error en obtenerTestimonios:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener los testimonios',
          error: error.message
        });
      }
    }
  
    async crearTestimonio(req, res) {
      try {
        const { comentario, calificacion, usuarioId } = req.body;
  
        if (calificacion < 1 || calificacion > 5) {
          return res.status(400).json({
            success: false,
            message: 'La calificación debe estar entre 1 y 5'
          });
        }
  
        const nuevoTestimonio = await Testimonio.create({
          comentario,
          calificacion,
          usuarioId
        });
 
        // Obtener el testimonio con la información del usuario
        const testimonioConUsuario = await Testimonio.findByPk(nuevoTestimonio.id, {
          include: [{
            model: Usuario,
            attributes: ['id', 'nombre']
          }]
        });
        
        return res.status(201).json({
          success: true,
          message: 'Testimonio creado exitosamente',
          testimonio: testimonioConUsuario
        });
      } catch (error) {
        console.error('Error en crearTestimonio:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al crear el testimonio',
          error: error.message
        });
      }
    }
  }
  
  module.exports = new TestimonioController();