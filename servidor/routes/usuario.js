const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { authenticate, authorize } = require('../middleware/authMiddleware')


router.get('/', authenticate, authorize(['admin']), UsuarioController.obtenerTodosLosUsuarios);
router.get("/:id", UsuarioController.obtenerUserById);
// Rutas para obtener torneos y testimonios del usuario
router.get('/torneos/:id', authenticate, UsuarioController.obtenerTorneosUsuario);
router.get('/testimonios/:id', authenticate, UsuarioController.obtenerTestimoniosUsuario);

// Ruta para actualizar perfil de usuario
router.put('/:id', authenticate, UsuarioController.actualizarPerfilUsuario);

module.exports = router;