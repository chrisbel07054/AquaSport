const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Importamos la conexión

const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  genero: { type: DataTypes.ENUM("masculino", "femenino"), allowNull: false },
  edad: { type: DataTypes.INTEGER, allowNull: false },
  rol: { type: DataTypes.ENUM("admin", "participante"), allowNull: false },
});

module.exports = Usuario;
