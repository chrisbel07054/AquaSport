const express = require('express');
const router = express.Router();
const TestimonioController = require('../controllers/TestimonioController');
const { authenticate } = require('../middleware/authMiddleware')

router.get('/', TestimonioController.obtenerTestimonios);
// Ruta para crear testimonio (requiere autenticación)
router.post('/', authenticate, TestimonioController.crearTestimonio);


module.exports = router;