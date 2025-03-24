const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const setupDatabase = require("./config/setupDB");

// Inicialización de la aplicación
const app = express();
app.use(cors());
app.use(express.json());


// Importar rutas
const authRoutes = require('./routes/auth');
const torneosRoutes = require('./routes/tournaments');
const testimonioRoutes = require('./routes/testimonials');
const usuarioRoutes = require('./routes/usuario');

// Usar rutas
app.use('/auth', authRoutes);
app.use('/torneo', torneosRoutes);
app.use('/testimonio', testimonioRoutes);
app.use('/usuario', usuarioRoutes);


const PORT = process.env.PORT || 8080;
// Configurar la base de datos antes de iniciar el servidor
setupDatabase()
  .then(() => {
    // Iniciar servidor después de configurar la base de datos
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al iniciar el servidor:", error);
  });
