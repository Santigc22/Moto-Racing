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
	tipoUser: Joi.number().max(10).required(),
	correo: Joi.string().max(255).required(),
});

const { sendOtpEmail } = require("../config/mailer");

// Función para generar un código OTP de 6 dígitos
const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000); // Genera un número entre 100000 y 999999
};

// Controlador para validar usuario y contraseña
const getUsers = async (req, res) => {
	try {
		// Obtener los datos del cuerpo de la solicitud
		const { username, password } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		// Ejecutar la consulta SQL para buscar al usuario por el nombre de usuario
		const [rows] = await conexion.execute(
			"SELECT * FROM usuario WHERE correo = ?",
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
			console.log(user);
			return res.status(401).json({
				success: false,
				message: "Contraseña incorrecta",
			});
		}

		// var expiresdTime = "1h";

		// Generar el OTP
		const otp = generateOTP();
		const fecha = new Date();
		const formattedDate = fecha.toISOString().slice(0, 19).replace("T", " "); // Formato 'YYYY-MM-DD HH:MM:SS'

		// Guardar el OTP en la base de datos
		await conexion.execute(
			"UPDATE usuario SET otp = ?, otp_generado_en = ? WHERE id = ?",
			[otp, formattedDate, user.id]
		);

		const userEmail = {
			correo: user.correo, // Asegúrate de que 'user' está correctamente definido
			nombre: user.nombre,
			apellido: user.apellido,
			otp: otp, // Asegúrate de que 'otp' tiene el valor correcto
		};

		// Enviar el correo electrónico con el OTP
		await sendOtpEmail(userEmail);

		res.status(200).json({
			message: "Contraseña correcta. Se ha enviado un código OTP a tu correo.",
			user_id: user.id,
			user_name: user.nombre,
			user_doc: user.identificacion,
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
			tipoUser,
			correo,
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
			tipoUser,
			correo,
		});

		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		// Encriptar la contraseña
		const hashedPassword = CryptoJS.SHA256(password).toString();

		// Obtener la conexión a la base de datos
		conexion = await connectDatabase();

		// Ejecutar la consulta SQL para insertar el usuario
		await conexion.execute(
			`INSERT INTO usuario (correo, nombre, apellido, tipo_identificacion_id, identificacion, 
		  fecha_nacimiento, direccion, telefono, password_hash, is_admin, id_tipo_usuario) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				correo,
				nombre,
				apellido,
				tipoIden,
				identificacion,
				fechaNaci,
				direccion,
				telefono,
				hashedPassword,
				0,
				tipoUser,
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

const verifyOTP = async (req, res) => {
	try {
		const { correo, otp } = req.body;

		// console.log(correo, otp);
		const conexion = await connectDatabase();
		const [rows] = await conexion.execute(
			"SELECT * FROM usuario WHERE correo = ? AND otp = ?",
			[correo, otp]
		);

		if (rows.length === 0) {
			return res.status(401).json({
				success: false,
				message: "Código OTP incorrecto",
			});
		}

		// OTP correcto, generar token de sesión
		const token = jwt.sign(
			{
				user_id: rows[0].id,
				user_email: rows[0].correo,
				user_name: rows[0].nombre,
				user_lastname: rows[0].apellido,
				user_tipe: rows[0].id_tipo_usuario,
			},
			process.env.SECRET_TOKEN,
			{
				expiresIn: "1h",
			}
		);

		res.set("Access-Control-Expose-Headers", "Authorization");
		res.setHeader("authorization", token);
		res.status(200).json({
			message: "Autenticación exitosa",
			user_id: rows[0].id,
			user_name: rows[0].nombre,
			user_lastname: rows[0].apellido,
			user_tipe: rows[0].id_tipo_usuario,
			authorization: token,
		});

		// Limpiar el OTP después de verificarlo
		await conexion.execute("UPDATE usuario SET otp = NULL WHERE correo = ?", [
			correo,
		]);
		await conexion.end();
	} catch (error) {
		console.error("Error al verificar OTP:", error);
		res.status(500).json({
			success: false,
			message: "Error al verificar el OTP",
		});
	}
};

const getUserInformation = async (req, res) => {
	const bearer = req.headers.authorization;

	if (!bearer) {
		const error = new Error("Unautorizado");
		res.status(401).json({ error: error.message });
	}

	const token = bearer

	try {
		const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
		const id = decoded.user_id;

		conexion = await connectDatabase();

		const [rows] = await conexion.execute(
			"SELECT nombre, apellido, tipo_identificacion_id, identificacion, fecha_nacimiento, direccion, telefono FROM usuario WHERE id = ?",
			[id]
		);

		if (rows.length === 0) {
			return res.status(401).json({
				success: false,
				message: "Usuario no encontrado",
			});
		}

		const user = rows[0];

		res.status(200).json({
			user_id: user.id,
			user_name: user.nombre,
			user_apellido: user.apellido,
			user_identificcacion: user.identificacion,
			user_fecha_nacimiento: user.fecha_nacimiento,
			user_direccion: user.direccion,
			user_telefono: user.telefono,
		});
	} catch (error) {
		res.status(500).json({ error: "Invalid token" });
	}
};

// Exportar el controlador
module.exports = { getUsers, setUsers, verifyOTP, getUserInformation };
