const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Importamos la conexión

const Torneo = sequelize.define("Torneo", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  deporte: {
    type: DataTypes.ENUM(
      "natación",
      "aguas abiertas",
      "triatlón",
      "acuatlón",
      "atletismo"
    ),
    allowNull: false
  },
  fecha: { type: DataTypes.DATE, allowNull: false },
  ubicacion: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  cupo: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.FLOAT, allowNull: false },
  estado: {
    type: DataTypes.ENUM("activo", "cancelado", "finalizado"),
    allowNull: false
  }
});

module.exports = Torneo;
