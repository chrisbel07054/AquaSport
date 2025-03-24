const express = require('express');
const router = express.Router();
const TorneoController = require('../controllers/TorneoController');
const { authenticate, authorize } = require('../middleware/authMiddleware')

//todos los torneos
router.get('/', authenticate, authorize(['admin']), TorneoController.obtenerTorneosConInscritos);
//torneos activos
router.get('/activos', TorneoController.obtenerTorneosActivos);
// Ruta para obtener torneos con filtros
router.get('/filtros', TorneoController.obtenerTorneosConFiltros);
// Ruta para obtener detalle de un torneo
router.get('/:id', TorneoController.obtenerTorneoPorId);
// Ruta para inscribirse (requieren autenticación)
router.post('/inscripcion/:id', authenticate, TorneoController.inscribirUsuario);

// Ruta para crear torneo (solo admin)
router.post('/', authenticate, authorize(['admin']), TorneoController.crearTorneo);

// Rutas para actualizar torneo y cambiar estado (solo admin)
router.put('/:id', authenticate, authorize(['admin']), TorneoController.actualizarTorneo);
router.put('/cambiar-estado/:id', authenticate, authorize(['admin']), TorneoController.cambiarEstadoTorneo);




module.exports = router;