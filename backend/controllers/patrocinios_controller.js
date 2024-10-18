const connectDatabase = require("../security/conexion");

const conectMongo = require("../security/conexionMongo");

const joi = require("joi");

const schemaPatrocinioInsert = joi.object({
	id_entidad: joi.number().required(),
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

const schemaPatrocinioCollection = joi.object({
	id_patrocinador: joi.number().required(),
	logo_id_patrocinador: joi.number().required(),
	id_entidad: joi.number().required(),
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

// Esquema para validar que el id sea Numerico
const schemaId = joi.object({
	id: joi.number().required(),
});

async function partesPilotoPatrocinio(req, res) {
	try {
		const id = req.params.id_piloto; //id_piloto

		const { error } = schemaId.validate({ id });
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const conexion = await connectDatabase();
		const [piloto] = await conexion.execute(
			`SELECT * FROM piloto WHERE id = ?`,
			[id]
		);

		if (piloto.length === 0) {
			return res.status(404).json({
				success: false,
				message: "El piloto no existe",
			});
		}

		const [rows] = await conexion.execute(
			`SELECT pp.id          AS id_parte,
       pp.nombre      AS nombre_parte,
       pp.descripcion AS descripcion_parte,
       pp.precio      AS precio_parte,
       ppp.is_enable  AS parte_disponible
FROM piloto_partes_patrocinio ppp
         JOIN piloto p ON p.id = ppp.id_piloto
         JOIN partes_piloto_patrocinio pp ON pp.id = ppp.id_parte_piloto_patrocinio
WHERE p.id = 1
  and ppp.is_enable = ?`,
			[id]
		);

		if (rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "El piloto no tiene partes disponibles",
			});
		}

		res.json({
			success: true,
			data: { ["partes"]: rows, ["piloto"]: piloto[0] },
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function createPatrocinioPiloto(req, res) {
	try {
		const conexion = await connectDatabase();

		for (const parte of req.body) {
			const { error } = schemaPatrocinioInsert.validate(parte);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}
			// const user_id = req.user.user_id;
			const user_id = 17;

			for (const partes_patrocinio of parte.partes_patrocinio) {
				// console.log(partes_patrocinio);

				const [rows] = await conexion.execute(
					`SELECT pp.id, ppp.is_enable       
FROM piloto_partes_patrocinio ppp
         JOIN piloto p ON p.id = ppp.id_piloto
         JOIN partes_piloto_patrocinio pp ON pp.id = ppp.id_parte_piloto_patrocinio
WHERE p.id = ?
  and pp.id = ?`,
					[parte.id_entidad, partes_patrocinio.id_parte]
				);
				const isEnableValue = rows[0].is_enable.readUInt8(0); // Convierte Buffer a número

				if (isEnableValue === 0) {
					const [parteErr] = await conexion.execute(
						`SELECT  pp.*
						from partes_piloto_patrocinio pp
						where pp.id=?`,
						[rows[0].id]
					);

					return res.status(404).json({
						success: false,
						message: parteErr[0].nombre + " no esta disponible",
					});
				} else {
					const update = await conexion.execute(
						`UPDATE piloto_partes_patrocinio
						SET is_enable = 0
						WHERE id_piloto = ?
						  and id_parte_piloto_patrocinio = ?`,
						[parte.id_entidad, partes_patrocinio.id_parte]
					);
					// console.log(update, "asdasd");
				}
			}

			parte.id_patrocinador = user_id;
			// console.log(parte);

			const patrocinios = conectMongo.collection("patrocinios");

			const insertMongo = await patrocinios.insertOne(parte);

			// console.log(insert);
			if (insertMongo.insertedCount === 0) {
				return res.status(400).json({
					success: false,
					message: "Error al insertar el patrocinio",
				});
			}

			//Insertar en la base de datos el id del patrocinio

			const [insert] = await conexion.execute(
				`INSERT INTO patrocinios_pilotos (id_patrocinador,id_patrocinio,id_piloto,id_logo,total) VALUES (?, ?, ?, ?, ?)`,
				[
					parte.id_patrocinador,
					insertMongo.insertedId,
					parte.id_entidad,
					1,
					parte.total,
				]
			);
			if (insert.affectedRows === 0) {
				return res.status(400).json({
					success: false,
					message: "Error al insertar el patrocinio",
				});
			}
		}
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

module.exports = {
	partesPilotoPatrocinio,
	createPatrocinioPiloto,
};
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
