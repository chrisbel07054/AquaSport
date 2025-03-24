const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Importamos la conexión
const Usuario = require("./Usuario");
const Torneo = require("./Torneo");

const Inscripcion = sequelize.define("Inscripcion", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

// Definir relaciones
Usuario.hasMany(Inscripcion, { foreignKey: "usuarioId" });
Inscripcion.belongsTo(Usuario, { foreignKey: "usuarioId" });

Torneo.hasMany(Inscripcion, { foreignKey: "torneoId" });
Inscripcion.belongsTo(Torneo, { foreignKey: "torneoId" });

module.exports = Inscripcion;
