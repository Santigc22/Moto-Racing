// Importar la función para conectarse a la base de datos
const connectDatabase = require("../security/conexion");
const bcrypt = require("bcrypt"); // Asegúrate de tener bcrypt instalado: npm install bcrypt

// Controlador para validar usuario y contraseña
const getUsers = async (req, res) => {
	try {
		// Obtener los datos del cuerpo de la solicitud
		const { username, password } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		// Ejecutar la consulta SQL para buscar al usuario por el nombre de usuario
		const [rows] = await conexion.execute("SELECT * FROM usuario WHERE nombre = ?", [username]);

		// Verificar si el usuario existe
		if (rows.length === 0) {
			return res.status(401).json({
				success: false,
				message: "Usuario no encontrado",
			});
		}

		const user = rows[0];


		console.log(user );
		// Comparar la contraseña proporcionada con la encriptada en la base de datos
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Contraseña incorrecta",
			});
		}

		// Si la validación es correcta, devolver los datos del usuario o cualquier respuesta
		res.json({
			success: true,
			message: "Inicio de sesión exitoso",
			data: {
				username: user.username,
				// Puedes agregar más datos del usuario si es necesario
			},
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


//Funcion que agregar a un usuario
const setUsers = async (req, res) => {
	try {
		// Obtener los datos del cuerpo de la solicitud
		const { username, password } = req.body;

		// Encriptar la contraseña
		const saltRounds = 10; // Número de rondas para encriptar la contraseña
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		// Ejecutar la consulta SQL para insertar el usuario
		await conexion.execute(
			"INSERT INTO usuario (nombre, password_hash,is_admin) VALUES (?, ?, 0)",
			[username, hashedPassword]
		);

		// Devolver una respuesta de éxito
		res.json({
			success: true,
			message: "Usuario creado exitosamente",
		});

		// Cerrar la conexión después de la inserción
		await conexion.end();
	} catch (error) {
		console.error("Error al insertar el usuario:", error);
		res.status(500).json({
			success: false,
			message: "Error al insertar el usuario en la base de datos",
		});
	}
};
// Exportar el controlador
module.exports = { getUsers, setUsers };
