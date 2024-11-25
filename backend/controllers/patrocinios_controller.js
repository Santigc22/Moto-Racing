const connectDatabase = require("../security/conexion");

const conectMongo = require("../security/conexionMongo");
const { ObjectId } = require("mongodb"); // Asegúrate de importar ObjectId
const joi = require("joi");

const { sendEmail } = require("../config/mailer");

const schemaPatrocinioInsert = joi.object({
	id_entidad: joi.number().required(),
	partes_patrocinio: joi.array().items(
		joi.object({
			id_parte: joi.number().required(),
			nombre: joi.string().required(),
			precio: joi.number().required(),
		})
	),
	logo_id: joi.number().required(),
	subtotal: joi.number().required(),
	porcentaje_aumento_entidad: joi.string().required(),
	total: joi.number().required(),
});

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
       ppp.precio      AS precio_parte,
       ppp.is_enable  AS parte_disponible
FROM piloto_partes_patrocinio ppp
         JOIN piloto p ON p.id = ppp.id_piloto
         JOIN partes_piloto_patrocinio pp ON pp.id = ppp.id_parte_piloto_patrocinio
WHERE p.id = ?
  and ppp.is_enable = 1`,
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
		const user_id = 11;

		const [usuario] = await conexion.execute(
			"SELECT * FROM usuario WHERE id = ?",
			[user_id]
		);
		const user = usuario[0];

		const userEmail = {
			correo: user.correo, // Asegúrate de que 'user' está correctamente definido
			nombre: user.nombre,
			apellido: user.apellido,
		};
		for (const parte of req.body) {
			const { error } = schemaPatrocinioInsert.validate(parte);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}
			// const user_id = req.user.user_id;

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
				`INSERT INTO patrocinios_pilotos (id_patrocinador,id_patrocinio,id_piloto,id_logo,total, fecha) VALUES (?, ?, ?, ?, ?, NOW())`,
				[
					parte.id_patrocinador,
					insertMongo.insertedId,
					parte.id_entidad,
					parte.logo_id,
					parte.total,
				]
			);
			if (insert.affectedRows === 0) {
				return res.status(400).json({
					success: false,
					message: "Error al insertar el patrocinio",
				});
			}
			await sendEmail(userEmail, parte, "Patrocinio de piloto");
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

async function partesEquipoPatrocinio(req, res) {
	try {
		const id = req.params.id_equipo; //id_equipo

		const { error } = schemaId.validate({ id });
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		// console.log(id);

		const conexion = await connectDatabase();
		const [equipo] = await conexion.execute(
			`SELECT * FROM equipo WHERE id = ?`,
			[id]
		);

		// console.log(equipo);

		if (equipo.length === 0) {
			return res.status(404).json({
				success: false,
				message: "El Equipo no existe",
			});
		}

		const [rows] = await conexion.execute(
			`SELECT pp.id          AS id_parte,
       pp.nombre      AS nombre_parte,
       pp.descripcion AS descripcion_parte,
       ppp.precio      AS precio_parte,
       ppp.is_enable  AS parte_disponible
FROM equipo_partes_patrocinio ppp
         JOIN equipo p ON p.id = ppp.id_equipo	
         JOIN partes_equipo_patrocinio pp ON pp.id = ppp.id_parte_equipo_patrocinio
WHERE p.id = ?
  and ppp.is_enable = 1`,
			[id]
		);

		// console.log(rows);
		if (rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "El equipo no tiene partes disponibles",
			});
		}

		res.json({
			success: true,
			data: { ["partes"]: rows, ["equipo"]: equipo[0] },
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

async function createPatrocinioEquipo(req, res) {
	try {
		const conexion = await connectDatabase();
		const user_id = 11;

		const [usuario] = await conexion.execute(
			"SELECT * FROM usuario WHERE id = ?",
			[user_id]
		);
		const user = usuario[0];

		const userEmail = {
			correo: user.correo, // Asegúrate de que 'user' está correctamente definido
			nombre: user.nombre,
			apellido: user.apellido,
		};
		for (const parte of req.body) {
			const { error } = schemaPatrocinioInsert.validate(parte);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}
			// const user_id = req.user.user_id;

			for (const partes_patrocinio of parte.partes_patrocinio) {
				// console.log(partes_patrocinio);

				const [rows] = await conexion.execute(
					`SELECT pp.id, ppp.is_enable       
FROM equipo_partes_patrocinio ppp
         JOIN equipo p ON p.id = ppp.id_equipo
         JOIN partes_equipo_patrocinio pp ON pp.id = ppp.id_parte_equipo_patrocinio
WHERE p.id = ?
  and pp.id = ?`,
					[parte.id_entidad, partes_patrocinio.id_parte]
				);
				const isEnableValue = rows[0].is_enable.readUInt8(0); // Convierte Buffer a número

				if (isEnableValue === 0) {
					const [parteErr] = await conexion.execute(
						`SELECT  pp.*
						from partes_equipo_patrocinio pp
						where pp.id=?`,
						[rows[0].id]
					);

					return res.status(404).json({
						success: false,
						message: parteErr[0].nombre + " no esta disponible",
					});
				} else {
					const update = await conexion.execute(
						`UPDATE equipo_partes_patrocinio
						SET is_enable = 0
						WHERE id_equipo = ?
						  and id_parte_equipo_patrocinio = ?`,
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
				`INSERT INTO patrocinios_equipos (id_patrocinador,id_patrocinio,id_equipo,id_logo,total, fecha) VALUES (?, ?, ?, ?, ?, NOW())`,
				[
					parte.id_patrocinador,
					insertMongo.insertedId,
					parte.id_entidad,
					parte.logo_id,
					parte.total,
				]
			);
			if (insert.affectedRows === 0) {
				return res.status(400).json({
					success: false,
					message: "Error al insertar el patrocinio",
				});
			}
			await sendEmail(userEmail, parte, "Patrocinio de equipo");
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

//* trae los patrocinios de un usuario, solo es sirve si el usuario es patrocinador
async function getPatrociniosUsuario(req, res) {
	const user_id = 11;

	const conexion = await connectDatabase();

	const [patrocinios_equipos] = await conexion.execute(
		`Select * from patrocinios_equipos where id_patrocinador = ?`,
		[user_id]
	);

	const [patrocinios_pilotos] = await conexion.execute(
		`Select * from patrocinios_pilotos where id_patrocinador = ?`,
		[user_id]
	);

	const [patrocinios_competencia] = await conexion.execute(
		`Select * from patrocinios_competencia where id_patrocinador = ?`,
		[user_id]
	);

	const patrocinios = conectMongo.collection("patrocinios");

	const patrociniosMongo = await patrocinios.find({ id_patrocinador: user_id });

	// console.log(patrociniosMongo);

	const patrociniosMongoArray = await patrociniosMongo.toArray();

	res.json({
		success: true,
		data: {
			patrocinios_equipos,
			patrocinios_pilotos,
			patrocinios_competencia,
			patrociniosMongoArray,
		},
	});
}

//* trae los patrocinios de un equipo, solo es sirve si el usuario tiene un equipo asociado como representante, por otro lado no puede representar mas de un equipo

async function getPatrociniosPatrocinador(req, res) {
	const user_id = 11;

	const conexion = await connectDatabase();

	const [equipo] = await conexion.execute(
		`SELECT * FROM equipo WHERE representante_id = ?`,
		[user_id]
	);

	console.log(equipo);
	if (equipo.length === 0) {
		return res.status(404).json({
			success: false,
			message: "El usuario no tiene un equipo asociado",
		});
	}

	const [patrocinios_equipos] = await conexion.execute(
		`Select * from patrocinios_equipos where id_equipo = ?`,
		[equipo[0].id]
	);

	console.log(patrocinios_equipos);

	const patrocinios = conectMongo.collection("patrocinios");

	const patrociniosMongoArray = [];
	for (const patrocinio of patrocinios_equipos) {
		patrocinio.id_patrocinio = patrocinio.id_patrocinio.replace(/['"]+/g, "");
		if (ObjectId.isValid(patrocinio.id_patrocinio)) {
			// Convertimos el id a ObjectId para que la consulta funcione correctamente
			const patrociniosMongo = await patrocinios
				.find({ _id: new ObjectId(patrocinio.id_patrocinio) })
				.toArray();

			// console.log(patrociniosMongo);
			patrociniosMongoArray.push(...patrociniosMongo);
		} else {
			console.warn(
				`El ID "${patrocinio.id_patrocinio}" no es un ObjectId válido.`
			);
		}
	}

	res.json({
		success: true,
		data: { patrocinios_equipos, patrociniosMongoArray },
	});
}

//* trae los patrocinios de un piloto, solo es sirve si el usuario es un piloto
async function getPatrociniosPiloto(req, res) {
	const user_id = 2;

	const conexion = await connectDatabase();

	const [piloto] = await conexion.execute(`SELECT * FROM piloto WHERE id = ?`, [
		user_id,
	]);

	// console.log(equipo);
	if (piloto.length === 0) {
		return res.status(404).json({
			success: false,
			message: "El usuario no es un piloto",
		});
	}

	const [patrocinios_piloto] = await conexion.execute(
		`Select * from patrocinios_pilotos where id_piloto = ?`,
		[piloto[0].id]
	);

	console.log(patrocinios_piloto);

	const patrocinios = conectMongo.collection("patrocinios");

	const patrociniosMongoArray = [];
	for (const patrocinio of patrocinios_piloto) {
		patrocinio.id_patrocinio = patrocinio.id_patrocinio.replace(/['"]+/g, "");
		if (ObjectId.isValid(patrocinio.id_patrocinio)) {
			// Convertimos el id a ObjectId para que la consulta funcione correctamente
			const patrociniosMongo = await patrocinios
				.find({ _id: new ObjectId(patrocinio.id_patrocinio) })
				.toArray();

			// console.log(patrociniosMongo);
			patrociniosMongoArray.push(...patrociniosMongo);
		} else {
			console.warn(
				`El ID "${patrocinio.id_patrocinio}" no es un ObjectId válido.`
			);
		}
	}

	res.json({
		success: true,
		data: { patrocinios_piloto, patrociniosMongoArray },
	});
}

//* trae las partes de un equipo, solo es sirve si el usuario tiene un equipo asociado como representante, por otro lado no puede representar mas de un equipo
async function get_partes_equipo(req, res) {
	try {
		const user_id = 11;

		const conexion = await connectDatabase();
		const [equipo] = await conexion.execute(
			`select * from equipo e where e.representante_id=?`,
			[user_id]
		);

		if (!equipo || equipo.length === 0) {
			return res.status(404).json({ error: "Equipo no encontrado" });
		}

		const [partes] = await conexion.execute(
			`SELECT ppp.id_equipo_patrocinio          AS id_parte,
			ppp.id_equipo,
       pp.nombre      AS nombre_parte,
       pp.descripcion AS descripcion_parte,
       ppp.precio      AS precio_parte,
       ppp.is_enable  AS parte_disponible
FROM equipo_partes_patrocinio ppp
         JOIN equipo p ON p.id = ppp.id_equipo	
         JOIN partes_equipo_patrocinio pp ON pp.id = ppp.id_parte_equipo_patrocinio
WHERE p.id = ?`,
			[equipo[0].id]
		);

		res.json({ partes: partes, equipo: equipo });
	} catch (error) {}
}

//* trae las partes de un piloto, solo es sirve si el usuario e sun piloto
async function get_partes_piloto(req, res) {
	try {
		const user_id = 2;

		console.log(user_id);

		const conexion = await connectDatabase();
		const [piloto] = await conexion.execute(
			`select * from piloto e where e.id=?`,
			[user_id]
		);

		if (!piloto || piloto.length === 0) {
			return res.status(404).json({ error: "Piloto no encontrado" });
		}
		const [partes] = await conexion.execute(
			`SELECT ppp.id_parte_piloto_patrocinio          AS id_parte,
			ppp.id_piloto,
       pp.nombre      AS nombre_parte,
       pp.descripcion AS descripcion_parte,
       ppp.precio      AS precio_parte,
       ppp.is_enable  AS parte_disponible
FROM piloto_partes_patrocinio ppp
         JOIN piloto p ON p.id = ppp.id_piloto	
         JOIN partes_piloto_patrocinio pp ON pp.id = ppp.id_parte_piloto_patrocinio
WHERE p.id = ?`,
			[piloto[0].id]
		);

		res.json({ partes: partes, piloto: piloto });
	} catch (error) {}
}

async function modificar_partes_equipo(req, res) {
	try {
		const user_id = 11;

		const conexion = await connectDatabase();
		const [equipo] = await conexion.execute(
			`select * from equipo e where e.representante_id=?`,
			[user_id]
		);

		const id_equipo = equipo[0].id;
		const { id_parte, is_enable, precio } = req.body;

		const updates = [];
		const values = [];

		// Verificar si se debe actualizar is_enable
		if (is_enable !== undefined) {
			updates.push("is_enable = ?");
			values.push(is_enable);
		}

		// Verificar si se debe actualizar precio
		if (precio !== undefined) {
			updates.push("precio = ?");
			values.push(precio);
		}

		// Si no hay actualizaciones, retornar error
		if (updates.length === 0) {
			return res.status(400).send("No se proporcionaron datos para actualizar");
		}

		// Conectar a la base de datos
		// const conexion = await connectDatabase();

		// Agregar los IDs al final de los valores
		values.push(id_equipo, id_parte);

		// Ejecutar la consulta de actualización
		const [result] = await conexion.execute(
			`UPDATE equipo_partes_patrocinio SET fecha_modificacion=NOW(), ${updates.join(
				", "
			)} WHERE id_equipo = ? AND id_equipo_patrocinio = ?`,
			values
		);

		// Verificar si se actualizó alguna fila
		if (result.affectedRows === 0) {
			return res.status(404).send("No se encontró la parte del equipo");
		}

		// Enviar respuesta exitosa
		res.json({ success: true, message: "Parte actualizada correctamente" });
	} catch (error) {
		// Manejo de errores
		// console.error(error);
		res.status(500).send("Error al actualizar la parte del equipo", error);
	}
}

async function modificar_partes_piloto(req, res) {
	try {
		const id_piloto = 2;
		const { id_parte, is_enable, precio } = req.body;
		const updates = [];
		const values = [];

		// Verificar si se debe actualizar is_enable
		if (is_enable !== undefined) {
			updates.push("is_enable = ?");
			values.push(is_enable);
		}

		// Verificar si se debe actualizar precio
		if (precio !== undefined) {
			updates.push("precio = ?");
			values.push(precio);
		}

		// Si no hay actualizaciones, retornar error
		if (updates.length === 0) {
			return res.status(400).send("No se proporcionaron datos para actualizar");
		}

		// Conectar a la base de datos
		const conexion = await connectDatabase();

		// Agregar los IDs al final de los valores
		values.push(id_piloto, id_parte);

		// Ejecutar la consulta de actualización
		const [result] = await conexion.execute(
			`UPDATE piloto_partes_patrocinio SET fecha_modificacion=NOW(), ${updates.join(
				", "
			)} WHERE id_piloto = ? AND id_parte_piloto_patrocinio = ?`,
			values
		);

		// Verificar si se actualizó alguna fila
		if (result.affectedRows === 0) {
			return res.status(404).send("No se encontró la parte del piloto");
		}

		// Enviar respuesta exitosa
		res.json({ success: true, message: "Parte actualizada correctamente" });
	} catch (error) {
		// Manejo de errores
		// console.error(error);
		res.status(500).send("Error al actualizar la parte del pilooto", error);
	}
}

//* Compentencias

//* trae las partes de una competencia, solo es sirve si la competencia existe
async function partesCompetenciaPatrocinio(req, res) {
	try {
		const id = req.params.id_competencia; //id_competencia

		const { error } = schemaId.validate({ id });
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const conexion = await connectDatabase();
		const [competencia] = await conexion.execute(
			`SELECT * FROM competencia WHERE id_competencia = ?`,
			[id]
		);

		if (competencia.length === 0) {
			return res.status(404).json({
				success: false,
				message: "La compentecia no existe no existe",
			});
		}

		const [rows] = await conexion.execute(
			`SELECT pp.id          AS id_parte,
       pp.nombre      AS nombre_parte,
       pp.descripcion AS descripcion_parte,
       ppp.precio      AS precio_parte,
       ppp.is_enable  AS parte_disponible
FROM competencia_partes_patrocinio ppp
         JOIN competencia p ON p.id_competencia = ppp.id_competencia
         JOIN partes_competencia_patrocinio pp ON pp.id = ppp.id_parte_competencia_patrocinio
WHERE p.id_competencia = ?
  and ppp.is_enable = 1`,
			[id]
		);

		if (rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "La compenecia no tiene partes disponibles",
			});
		}

		res.json({
			success: true,
			data: { ["partes"]: rows, ["compentecia"]: competencia[0] },
		});
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
}

// crear patrocinio de una competencia
async function createPatrocinioCompetencia(req, res) {
	try {
		const conexion = await connectDatabase();
		const user_id = 11;

		const [usuario] = await conexion.execute(
			"SELECT * FROM usuario WHERE id = ?",
			[user_id]
		);
		const user = usuario[0];

		const userEmail = {
			correo: user.correo, // Asegúrate de que 'user' está correctamente definido
			nombre: user.nombre,
			apellido: user.apellido,
		};
		for (const parte of req.body) {
			const { error } = schemaPatrocinioInsert.validate(parte);
			if (error) {
				return res.status(400).json({
					success: false,
					message: error.details[0].message,
				});
			}
			// const user_id = req.user.user_id;

			for (const partes_patrocinio of parte.partes_patrocinio) {
				// console.log(partes_patrocinio);

				const [rows] = await conexion.execute(
					`SELECT pp.id, ppp.is_enable       
FROM competencia_partes_patrocinio ppp
         JOIN competencia p ON p.id_competencia = ppp.id_competencia
         JOIN partes_competencia_patrocinio pp ON pp.id = ppp.id_parte_competencia_patrocinio
WHERE p.id_competencia = ?
  and pp.id = ?`,
					[parte.id_entidad, partes_patrocinio.id_parte]
				);
				const isEnableValue = rows[0].is_enable.readUInt8(0); // Convierte Buffer a número

				if (isEnableValue === 0) {
					const [parteErr] = await conexion.execute(
						`SELECT  pp.*
						from partes_competencia_patrocinio pp
						where pp.id=?`,
						[rows[0].id]
					);

					return res.status(404).json({
						success: false,
						message: parteErr[0].nombre + " no esta disponible",
					});
				} else {
					const update = await conexion.execute(
						`UPDATE competencia_partes_patrocinio
						SET is_enable = 0
						WHERE id_competencia = ?
						  and id_parte_competencia_patrocinio = ?`,
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
				`INSERT INTO patrocinios_competencia (id_patrocinador,id_patrocinio,id_competencia,id_logo,total, fecha) VALUES (?, ?, ?, ?, ?, NOW())`,
				[
					parte.id_patrocinador,
					insertMongo.insertedId,
					parte.id_entidad,
					parte.logo_id,
					parte.total,
				]
			);
			if (insert.affectedRows === 0) {
				return res.status(400).json({
					success: false,
					message: "Error al insertar el patrocinio",
				});
			}
			await sendEmail(userEmail, parte, "Patrocinio de Compentencia");
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

async function getPatrociniosByCompentencia(req, res) {
	const id_competencia = req.params.id_competencia;
	const conexion = await connectDatabase();

	const [compentencia] = await conexion.execute(
		`SELECT * FROM competencia WHERE id_competencia = ?`,
		[id_competencia]
	);

	if (compentencia.length === 0) {
		return res.status(404).json({
			success: false,
			message: "La compentecia no existe no existe",
		});
	}

	const [patrocinios_competencias] = await conexion.execute(
		`Select * from patrocinios_competencia where id_competencia = ?`,
		[compentencia[0].id_competencia]
	);

	// console.log(patrocinios_competencias);

	const patrocinios = conectMongo.collection("patrocinios");

	const patrociniosMongoArray = [];
	for (const patrocinio of patrocinios_competencias) {
		patrocinio.id_patrocinio = patrocinio.id_patrocinio.replace(/['"]+/g, "");
		if (ObjectId.isValid(patrocinio.id_patrocinio)) {
			// Convertimos el id a ObjectId para que la consulta funcione correctamente
			const patrociniosMongo = await patrocinios
				.find({ _id: new ObjectId(patrocinio.id_patrocinio) })
				.toArray();

			// console.log(patrociniosMongo);
			patrociniosMongoArray.push(...patrociniosMongo);
		} else {
			console.warn(
				`El ID "${patrocinio.id_patrocinio}" no es un ObjectId válido.`
			);
		}
	}

	res.json({
		success: true,
		data: { patrocinios_competencias, patrociniosMongoArray },
	});
}

async function get_partes_competencia(req, res) {
	try {
		const id_competencia = req.params.id_competencia;

		if (!id_competencia) {
			return res.status(400).json({
				success: false,
				message: "El ID de la competencia es obligatorio.",
			});
		}

		const conexion = await connectDatabase();

		// Obtener competencia
		const [competencia] = await conexion.execute(
			`SELECT * FROM competencia e WHERE e.id_competencia = ?`,
			[id_competencia]
		);

		if (!competencia || competencia.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Competencia no encontrada.",
			});
		}

		// Obtener partes de la competencia
		const [partes] = await conexion.execute(
			`SELECT 
                ppp.id_parte_competencia_patrocinio AS id_parte,
                ppp.id_competencia,
                pp.nombre AS nombre_parte,
                pp.descripcion AS descripcion_parte,
                ppp.precio AS precio_parte,
                ppp.is_enable AS parte_disponible
             FROM competencia_partes_patrocinio ppp
             JOIN competencia p ON p.id_competencia = ppp.id_competencia
             JOIN partes_competencia_patrocinio pp ON pp.id = ppp.id_parte_competencia_patrocinio
             WHERE p.id_competencia = ?`,
			[competencia[0].id_competencia]
		);

		// Validar que haya partes disponibles
		if (!partes || partes.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No se encontraron partes para la competencia especificada.",
			});
		}

		// Respuesta exitosa
		res.status(200).json({
			success: true,
			competencia: competencia[0],
			partes: partes,
		});
	} catch (error) {
		console.error("Error al obtener partes de la competencia:", error);

		res.status(500).json({
			success: false,
			message:
				"Ocurrió un error inesperado al obtener las partes de la competencia.",
			error: error.message, // Opcional, útil para depuración
		});
	}
}

async function modificar_partes_competencia(req, res) {
	try {
		const id_competencia = req.params.id_competencia;
		const { id_parte, is_enable, precio } = req.body;
		const updates = [];
		const values = [];

		// Verificar si se debe actualizar is_enable
		if (is_enable !== undefined) {
			updates.push("is_enable = ?");
			values.push(is_enable);
		}

		// Verificar si se debe actualizar precio
		if (precio !== undefined) {
			updates.push("precio = ?");
			values.push(precio);
		}

		// Si no hay actualizaciones, retornar error
		if (updates.length === 0) {
			return res.status(400).send("No se proporcionaron datos para actualizar");
		}

		// Conectar a la base de datos
		const conexion = await connectDatabase();

		// Agregar los IDs al final de los valores
		values.push(id_competencia, id_parte);

		// Ejecutar la consulta de actualización
		const [result] = await conexion.execute(
			`UPDATE competencia_partes_patrocinio SET fecha_modificacion=NOW(), ${updates.join(
				", "
			)} WHERE id_competencia = ? AND id_parte_competencia_patrocinio = ?`,
			values
		);

		// Verificar si se actualizó alguna fila
		if (result.affectedRows === 0) {
			return res.status(404).send("No se encontró la parte del piloto");
		}

		// Enviar respuesta exitosa
		res.json({ success: true, message: "Parte actualizada correctamente" });
	} catch (error) {
		// Manejo de errores
		// console.error(error);
		res.status(500).send("Error al actualizar la parte del pilooto", error);
	}
}

async function getPatrociniosByPatrocinador(req, res) {
	try {
		const id_usuario = 11; // Cambia este valor según corresponda o úsalo como parámetro dinámico.

		if (!id_usuario) {
			return res.status(400).json({
				success: false,
				message: "El ID del usuario es obligatorio.",
			});
		}

		const conexion = await connectDatabase();

		// Consultar los patrocinios en la base de datos relacional
		const [patrocinios_competencias] = await conexion.execute(
			`SELECT * FROM patrocinios_competencia WHERE id_patrocinador = ?`,
			[id_usuario]
		);

		if (!patrocinios_competencias || patrocinios_competencias.length === 0) {
			return res.status(404).json({
				success: false,
				message:
					"No se encontraron patrocinios para el patrocinador especificado.",
			});
		}

		const patrocinios = conectMongo.collection("patrocinios");

		const patrociniosMongoArray = [];
		for (const patrocinio of patrocinios_competencias) {
			if (!patrocinio.id_patrocinio) {
				console.warn(
					"Patrocinio sin ID detectado en la base de datos relacional."
				);
				continue;
			}

			patrocinio.id_patrocinio = patrocinio.id_patrocinio.replace(/['"]+/g, "");

			if (ObjectId.isValid(patrocinio.id_patrocinio)) {
				try {
					// Buscar patrocinio en MongoDB
					const patrociniosMongo = await patrocinios
						.find({ _id: new ObjectId(patrocinio.id_patrocinio) })
						.toArray();

					patrociniosMongoArray.push(...patrociniosMongo);
				} catch (mongoError) {
					console.error(
						`Error al buscar el patrocinio con ID "${patrocinio.id_patrocinio}" en MongoDB:`,
						mongoError
					);
				}
			} else {
				console.warn(
					`El ID "${patrocinio.id_patrocinio}" no es un ObjectId válido.`
				);
			}
		}

		res.status(200).json({
			success: true,
			data: { patrocinios_competencias, patrociniosMongoArray },
		});
	} catch (error) {
		console.error("Error al obtener los patrocinios por patrocinador:", error);

		res.status(500).json({
			success: false,
			message: "Ocurrió un error al obtener los patrocinios.",
			error: error.message, // Opcional para depuración
		});
	}
}

module.exports = {
	partesPilotoPatrocinio,
	createPatrocinioPiloto,
	partesEquipoPatrocinio,
	createPatrocinioEquipo,
	getPatrociniosUsuario,
	getPatrociniosPatrocinador,
	get_partes_equipo,
	get_partes_piloto,
	modificar_partes_equipo,
	modificar_partes_piloto,
	getPatrociniosPiloto,
	partesCompetenciaPatrocinio,
	createPatrocinioCompetencia,
	getPatrociniosByCompentencia,
	get_partes_competencia,
	modificar_partes_competencia,
	getPatrociniosByPatrocinador,
};
