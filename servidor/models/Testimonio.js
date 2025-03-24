const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); // Importamos la conexión
const Usuario = require("./Usuario");

const Testimonio = sequelize.define("Testimonio", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  comentario: { type: DataTypes.TEXT, allowNull: false },
  calificacion: { type: DataTypes.INTEGER, allowNull: false, 
    validate: {
      min: 1,
      max: 5
    } 
  },
});

// Relación
Usuario.hasMany(Testimonio, { foreignKey: "usuarioId" });
Testimonio.belongsTo(Usuario, { foreignKey: "usuarioId" });

module.exports = Testimonio;
