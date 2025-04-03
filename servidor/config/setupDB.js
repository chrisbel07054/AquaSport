const bcrypt = require("bcryptjs");
const { sequelize, connectDatabase } = require("./database");

// Importar modelos (relaciones ya están dentro de ellos)
require("../models/Usuario");
require("../models/Torneo");
require("../models/Inscripcion");
require("../models/Ganador");
require("../models/Testimonio");

const Usuario = require("../models/Usuario");

const setupDatabase = async () => {
  try {
    await connectDatabase(); // Conexion a la BD.

    // Crear tablas.
    await sequelize.sync({ alter: true });
    console.log("Tablas creadas si no existían.");

    // Verificar si el usuario admin ya existe
    const adminExiste = await Usuario.findOne({ where: { rol: "admin" } });

    if (!adminExiste) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await Usuario.create({
        nombre: "Administrador",
        email: "admin@example.com",
        password: hashedPassword,
        genero: "masculino",
        edad: 30,
        rol: "admin"
      });
      console.log("Usuario admin creado con éxito.");
    }
  } catch (error) {
    console.error("Error al configurar la base de datos:", error);
  }
};

module.exports = setupDatabase;
