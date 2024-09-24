// Importar las dependencias necesarias
const mysql = require("mysql2/promise");
require("dotenv").config(); // Cargar las variables desde el archivo .env

// Función para conectar a la base de datos MySQL
async function connectDatabase() {
	try {
		const conexion = await mysql.createConnection({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

		console.log("Conexión exitosa a MySQL");

		// Devolver la conexión para que pueda ser utilizada
		return conexion;
	} catch (error) {
		// console.error("Error al conectar con la base de datos:", error);
		throw error; // Manejo del error
	}
}

// Exportar la función para que pueda ser utilizada en otros archivos
module.exports = connectDatabase;
