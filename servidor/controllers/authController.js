const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthController {
  async register(req, res) {
    try {
      const { nombre, email, password, genero, edad, rol = 'participante' } = req.body;

      // Verificar si el correo ya está registrado
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: 'El correo ya está registrado'
        });
      }

      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear el usuario
      const nuevoUsuario = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        genero,
        edad,
        rol
      });

      // Generar token JWT
      const token = jwt.sign(
        { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // No devolver la contraseña en la respuesta
      const usuarioSinPassword = nuevoUsuario.toJSON();
      delete usuarioSinPassword.password;
      usuarioSinPassword.token = token;

      return res.json({
        success: true,
        message: 'Usuario registrado exitosamente',
        usuario: usuarioSinPassword
      });
    } catch (error) {
      console.error('Error en register:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Verificar si el usuario existe
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(400).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Verificar la contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(400).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // No devolver la contraseña en la respuesta
      const usuarioSinPassword = usuario.toJSON();
      delete usuarioSinPassword.password;
      usuarioSinPassword.token = token;
 

      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        usuario: usuarioSinPassword
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();
