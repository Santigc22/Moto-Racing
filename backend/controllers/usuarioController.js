// Importar la función para conectarse a la base de datos
const connectDatabase = require("../security/conexion");

// Controlador para realizar consultas a la base de datos
const getUsers = async (req, res) => {
	try {
		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		// Ejecutar una consulta SQL
		const [rows, fields] = await conexion.execute("SELECT * FROM usuario");

		// Devolver los resultados en la respuesta
		res.json({
			success: true,
			data: rows,
		});

		// Cerrar la conexión después de la consulta
		await conexion.end();
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
};

// Exportar el controlador
module.exports = { getUsers };
