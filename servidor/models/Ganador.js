const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Importamos la conexión
const Usuario = require("./Usuario"); // Usuario que puede ser ganador
const Torneo = require("./Torneo"); // Torneo asociado

const Ganador = sequelize.define("Ganador", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  usuarioId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  torneoId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
});

// Definir relaciones
Usuario.hasMany(Ganador, { foreignKey: "usuarioId" });
Ganador.belongsTo(Usuario, { foreignKey: "usuarioId" });

Torneo.hasMany(Ganador, { foreignKey: "torneoId" });
Ganador.belongsTo(Torneo, { foreignKey: "torneoId" });

module.exports = Ganador;