const connectDatabase = require("../security/conexion");

async function tipo_identificacion(req, res) {
	try {
		const conexion = await connectDatabase();
		const [rows] = await conexion.execute("SELECT * FROM tipo_identificacion");
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function tipo_usuario(req, res) {
	try {
		const conexion = await connectDatabase();
		const [rows] = await conexion.execute("SELECT * FROM tipo_usuario");
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function tipo_sangre(req, res) {
	try {
		const conexion = await connectDatabase();
		const [rows] = await conexion.execute("SELECT * FROM tipo_sangre");
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function pais(res, res) {
	try {
		const conexion = await connectDatabase();
		const [rows] = await conexion.execute("SELECT * FROM pais");
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function departamento(req, res) {
	try {
		const conexion = await connectDatabase();
		const id_pais = req.params.id_pais;
		if (!id_pais) {
			return res.status(400).json({
				success: false,
				message: "El id del país es requerido",
			});
		}

		const query = `SELECT * FROM departamento WHERE id_pais = ?`;
		const [rows] = await conexion.execute(query, [id_pais]);
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function ciudad(req, res) {
	try {
		const conexion = await connectDatabase();
		const id_departamento = req.params.id_departamento;

		if (!id_departamento) {
			return res.status(400).json({
				success: false,
				message: "El id del departamento es requerido",
			});
		}

		const query = `SELECT * FROM ciudad WHERE id_departamento = ?`;
		const [rows] = await conexion.execute(query, [id_departamento]);
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function competencias(req, res) {
	try {
		const conexion = await connectDatabase();
		const [rows] = await conexion.execute("SELECT * FROM competencias");
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function categoria_carrera(req, res) {
	try {
		const conexion = await connectDatabase();
		const [rows] = await conexion.execute("SELECT * FROM categoria_carrera");
		res.json({
			success: true,
			data: rows,
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}
module.exports = {
	tipo_identificacion,
	tipo_usuario,
	tipo_sangre,
	pais,
	departamento,
	ciudad,
	competencias,
	categoria_carrera,
};
