const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

const DB_NAME = "aquasport";
const DB_USER = "root";
const DB_PASSWORD = null;
const DB_HOST = "localhost";

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
  console.log(`Base de datos '${DB_NAME}' verificada.`);
  await connection.end();
}

// Conexión con Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql"
});

async function connectDatabase() {
  await createDatabaseIfNotExists();
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con la base de datos.");
  } catch (error) {
    console.error("Error de conexión con la base de datos:", error);
  }
}

module.exports = { sequelize, connectDatabase };
