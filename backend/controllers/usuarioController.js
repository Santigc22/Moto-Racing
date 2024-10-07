// Importar la función para conectarse a la base de datos
const connectDatabase = require("../security/conexion");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const parametersUser = Joi.object({
	nombre: Joi.string().max(255).required(),
	apellido: Joi.string().max(255).required(),
	tipoIden: Joi.number().max(10).required(),
	fechaNaci: Joi.date().required(),
	direccion: Joi.string().max(255).required(),
	telefono: Joi.string().max(19).required(),
	identificacion: Joi.string().max(10).required(),
	password: Joi.string().max(255).required(),
	tipoUser: Joi.number().max(10).required()
});

// Controlador para validar usuario y contraseña
const getUsers = async (req, res) => {
	try {
		// Obtener los datos del cuerpo de la solicitud
		const { username, password } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		// Ejecutar la consulta SQL para buscar al usuario por el nombre de usuario
		const [rows] = await conexion.execute(
			"SELECT * FROM usuario WHERE identificacion = ?",
			[username]
		);

		// Verificar si el usuario existe
		if (rows.length === 0) {
			return res.status(401).json({
				success: false,
				message: "Usuario no encontrado",
			});
		}

		const user = rows[0];

		// process.env.CODE_SECRET_DATA;
		const hashedPassword = CryptoJS.SHA256(
			password,
			process.env.CODE_SECRET_DATA
		).toString();
		console.log(hashedPassword);

		// Comparar la contraseña hasheada con la almacenada en la base de datos
		if (user.password_hash !== hashedPassword) {
			return res.status(401).json({
				success: false,
				message: "Contraseña incorrecta",
			});
		}

		var expiresdTime = "1h";

		const token = jwt.sign(
			{
				user_id: user.id,
				user_name: user.nombre,
				user_doc: user.identificacion,
			},
			process.env.SECRET_TOKEN,
			{
				expiresIn: expiresdTime,
			}
		);

		res.set("Access-Control-Expose-Headers", "Authorization");
		res.setHeader("authorization", token);
		res.status(200).json({
			message: "Inicio de sesión exitoso",
			user_id: user.id,
			user_name: user.nombre,
			user_apellido: user.apellido,
			user_doc: user.identificacion,
			authorization: token,
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
	let conexion = null; // Inicializar la conexión como null

	

	try {
		// Obtener los datos del cuerpo de la solicitud
		const {
			nombre,
			apellido,
			tipoIden,
			fechaNaci,
			direccion,
			telefono,
			identificacion,
			password,
			tipoUser
		} = req.body;
	
		console.log(req.body);
		//Validar errores
	
		const { error } = parametersUser.validate({
			nombre,
			apellido,
			tipoIden,
			fechaNaci,
			direccion,
			telefono,
			identificacion,
			password,
			tipoUser
		})

		if(error)
		{
			return(res.status(400).json({error:error.details[0].message}))
		}

		// Encriptar la contraseña
		const hashedPassword = CryptoJS.SHA256(password).toString();

		// Obtener la conexión a la base de datos
		conexion = await connectDatabase();

		// Ejecutar la consulta SQL para insertar el usuario
		await conexion.execute(
			`INSERT INTO usuario (nombre, apellido, tipo_identificacion_id, identificacion, 
		  fecha_nacimiento, direccion, telefono, password_hash, is_admin, id_tipo_usuario) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
			[
				nombre,
				apellido,
				tipoIden,
				identificacion,
				fechaNaci,
				direccion,
				telefono,
				hashedPassword,
				0,
				tipoUser
			]
		);

		// Devolver una respuesta de éxito
		res.json({
			success: true,
			message: "Usuario creado exitosamente",
		});
	} catch (error) {
		console.error("Error al insertar el usuario:", error);
		res.status(500).json({
			success: false,
			message: "Error al insertar el usuario en la base de datos",
		});
	} finally {
		// Asegurarse de cerrar la conexión a la base de datos si existe
		if (conexion) {
			await conexion.end();
		}
	}
};

// Exportar el controlador
module.exports = { getUsers, setUsers };
