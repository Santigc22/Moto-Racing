const connectDatabase = require("../security/conexion");

const conectMongo = require("../security/conexionMongo");

const joi = require("joi");

const schemaPatrocinioInsert = joi.object({
	id_entidad: joi.number().required(),
	id_entidad_patrocinada: joi.number().required(),
	partes_patrocinio: joi.array().items(
		joi.object({
			id_parte: joi.number().required(),
			nombre: joi.string().required(),
			precio: joi.number().required(),
		})
	),
	subtotal: joi.number().required(),
});



const schemaPatrocinioCollection = joi.object({
	id_patrocinador: joi.number().required(),
	logo_id_patrocinador: joi.number().required(),
	id_entidad: joi.number().required(),
	id_entidad_patrocinada: joi.number().required(),
	partes_patrocinio: joi.array().items(
		joi.object({
			id_parte: joi.number().required(),
			nombre: joi.string().required(),
			precio: joi.number().required(),
		})
	),
	subtotal: joi.number().required(),
	porcentaje_aumento_entidad: joi.string().required(),
	total: joi.number().required(),
});

//* Una vez el usuario elige que desea patrocinar se le devolveran las partes de esa entidad en las que puede poner su publicad
//* 1. Se obtienes las partes de la competencia
//* 2. Se obtienen las partes de la carrera
//* 3. Se obtienen las partes del equipo
//* 4. Se obtienen las partes del piloto
//* Se le devolveran las partes de la entidad que puede patrocinar
async function partePatrocinio(req, res) {
	try {
		const conexion = await connectDatabase();

		const entidad = req.params.entidad;
		if (!entidad) {
			return res.status(400).json({
				success: false,
				message: "La entidad es obligatoria",
			});
		}

		let nombreEntidad;
		if (entidad == 1) {
			nombreEntidad = "competencia";
		}
		if (entidad == 2) {
			nombreEntidad = "carrera";
		}
		if (entidad == 3) {
			nombreEntidad = "equipo";
		}

		if (entidad == 4) {
			nombreEntidad = "piloto";
		}

		const nombre_tabla = `partes_${nombreEntidad}_patrocinio`;

		const [rows] = await conexion.execute(`SELECT * FROM ${nombre_tabla}`);
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

async function insertPatrocinio(req, res) {
	try {
		for (const parte of req.body) {
			const { error } = schemaPatrocinioInsert.validate(parte);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}
			const user_id = req.user.user_id;

			const total = parseFloat((parte.subtotal * 1.1).toFixed(3));
			parte.id_patrocinador = user_id;
			parte.total = total;

			console.log(parte);
		}

		const conexion = await connectDatabase();

		res.json({
			success: true,
			message: "Patrocinio insertado correctamente",
		});
	} catch (error) {
		console.error("Error al insertar el patrocinio:", error);
		res.status(500).json({
			success: false,
			message: "Error al insertar el patrocinio",
		});
	}
}

module.exports = { partePatrocinio, insertPatrocinio };
// {
//         "id_patrocinador":1,
//         "logo_id_patrocinador":13,
//         "id_entidad": 1,
//         "partes_patrocinio": [
//             {
//                 "id_parte": 1,
//                 "nombre":"El patrocinador da nombre a toda la competencia",
//                 "precio": 10000
//             }, {
//                 "id_parte": 2,
//                 "nombre":"Rueda de Prensa Oficial",
//                 "precio": 4000
//             }
//         ],
//         "subtotal":14000,
//         "porcentaje_aumento_entidad":"10%",
//         "total":15400
//     }
