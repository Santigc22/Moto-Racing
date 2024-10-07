const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// Obtener la URI desde el archivo .env
const uri = process.env.MONGODB_URI;

// Crear un cliente MongoClient con una MongoClientOptions para establecer la versión estable de la API
const conexion = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

// Función para conectar a la base de datos
async function connectDatabase() {
	try {
		await conexion.connect(); // Conectar al servidor de MongoDB
		// console.log("Conexión exitosa a MongoDB");
	} catch (error) {
		console.error("Error al conectar con la base de datos:", error);
	}
}

// Conectar a la base de datos
connectDatabase();
const conexionDB = conexion.db("elegaNNza");
// Exportar el cliente MongoDB para su uso en otros archivos
module.exports = conexionDB;
