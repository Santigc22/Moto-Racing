// Importar la función para conectarse a la base de datos
const { mode } = require("crypto-js");
const connectDatabase = require("../security/conexion");


const getpiloto = async (req, res) => {
	try {

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute(`SELECT p.id, u.nombre||' '||u.apellido AS nombre
                                                FROM piloto p 
                                                INNER JOIN usuario u ON u.id = p.id `);

		res.json({
			success: true,
			response: rows			
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


const getMotos = async (req, res) => {
	try {

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute(`SELECT m.id,u.nombre||' '||u.apellido AS nombre,m.marca,m.modelo,m.soat,m.referencia,m.tipo_moto
                                            FROM moto m 
                                            INNER JOIN piloto p ON p.id = m.piloto_id 
                                            INNER JOIN usuario u ON u.id = p.id   
											WHERE m.estado = 1`);

		res.json({
			success: true,
			response: rows			
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


const getMotoId = async (req, res) => { 
	try {

        const { id } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute("SELECT * FROM moto WHERE id = ?", [id]);


		res.json({
			success: true,
			response: rows			
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

//Funcion que agregar las motos
const setMotos = async (req, res) => {
	let conexion = null; // Inicializar la conexión como null
	try {
		// Obtener los datos del cuerpo de la solicitud
		const {
			pilotoId,
            marca,
            modelo,
            soat,
			tipoMoto,
			referencia
		} = req.body;

		console.log(req.body);
		// Obtener la conexión a la base de datos
		conexion = await connectDatabase();

		// Ejecutar la consulta SQL
		await conexion.execute(
			`INSERT INTO moto (piloto_id, marca, modelo,soat,referencia,tipo_moto) 
		VALUES (?, ?, ?, ?, ?, ?)`,
			[
				pilotoId,
                marca,
                modelo,
                soat,
				tipoMoto,
				referencia
			]
		);

		// Devolver una respuesta de éxito
		res.json({
			success: true,
			message: "Moto creada exitosamente",
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

const estadoMoto = async (req, res) => {
    const id = parseInt(req.params.id);
    let conexion = null;
    try {
        conexion = await connectDatabase();

        await conexion.execute('UPDATE moto set estado = 0 WHERE id = ?', [id]);

        res.json({
            success: true,
            message: "Dato actualizado correctamente",
        });
    } catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar en la base de datos",
        });
    } finally {
        if (conexion) {
            await conexion.end();
        }
    }
};


const updateMoto = async (req, res) => {
    let conexion = null;
    try {
		const {
			marca,
			pilotoId,
            modelo,
            soat,
			idMoto,
			tipoMoto,
			referencia
		} = req.body;

        conexion = await connectDatabase();

        await conexion.execute(`UPDATE moto 
								set marca = ?,
								piloto_id = ?,
								modelo = ?,
								soat = ?,
								referencia = ?,
								tipo_moto = ?
								WHERE id = ?`, [marca, pilotoId,modelo,soat,referencia,tipoMoto,idMoto]);

        res.json({
            success: true,
            message: "Dato actualizado correctamente",
        });
    } catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar en la base de datos",
        });
    } finally {
        if (conexion) {
            await conexion.end();
        }
    }
};



// Exportar el controlador
module.exports = { setMotos, getpiloto, getMotos, estadoMoto, getMotoId, updateMoto };
