const Torneo = require('../models/Torneo');
const Inscripcion = require('../models/Inscripcion');
const Usuario = require('../models/Usuario');
const Testimonio = require("../models/Testimonio");
const Ganador = require("../models/Ganador");

class UsuarioController {
  async obtenerTorneosUsuario(req, res) {
    try {
      const { id } = req.params;

      const inscripciones = await Inscripcion.findAll({
        where: { usuarioId: id },
        include: [
          {
            model: Torneo,
            attributes: [
              "id",
              "nombre",
              "deporte",
              "fecha",
              "ubicacion",
              "estado"
            ]
          }
        ]
      });

      const torneos = inscripciones.map((inscripcion) => inscripcion.Torneo);

      return res.status(200).json({
        success: true,
        torneos
      });
    } catch (error) {
      console.error("Error en obtenerTorneosUsuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los torneos del usuario",
        error: error.message
      });
    }
  }

  async obtenerTestimoniosUsuario(req, res) {
    try {
      const { id } = req.params;

      const testimonios = await Testimonio.findAll({
        where: { usuarioId: id },
        order: [["createdAt", "DESC"]]
      });

      return res.status(200).json({
        success: true,
        testimonios
      });
    } catch (error) {
      console.error("Error en obtenerTestimoniosUsuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los testimonios del usuario",
        error: error.message
      });
    }
  }

  async actualizarPerfilUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, genero, edad } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }

      // Datos a actualizar
      const datosActualizados = { nombre, email, genero, edad };
      await usuario.update(datosActualizados);

      return res.status(200).json({
        success: true,
        message: "Perfil actualizado exitosamente",
        usuario: datosActualizados
      });
    } catch (error) {
      console.error("Error en actualizarPerfilUsuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el perfil",
        error: error.message
      });
    }
  }

  async obtenerTodosLosUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ["password"] },
        where: { rol: "participante" },
        order: [["createdAt", "DESC"]]
      });

      return res.status(200).json({
        success: true,
        usuarios
      });
    } catch (error) {
      console.error("Error en obtenerTodosLosUsuarios:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener todos los usuarios",
        error: error.message
      });
    }
  }

  async obtenerUserById(req, res) {
    try {
      const usuarioId = req.params.id;

      const usuario = await Usuario.findOne({
        where: { id: usuarioId },
        attributes: { exclude: ["password"] }
      });

      // Verificar si el usuario existe
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }

      // Verificar torneos ganados por el usuario en el modelo 'Ganador'
      const torneosGanados = await Ganador.findAll({
        where: { usuarioId },
        include: [
          {
            model: Torneo
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: "Datos del usuario y torneos ganados",
        usuario,
        torneosGanados
      });
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los datos",
        error: error.message
      });
    }
  }
}

module.exports = new UsuarioController();