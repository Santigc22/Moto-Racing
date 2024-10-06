// Importar la función para conectarse a la base de datos
const connectDatabase = require("../security/conexion");

const getTerreno = async (req, res) => {
	try {

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute(`SELECT * FROM terrenos `);

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


const getPais = async (req, res) => {
	try {

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute(`SELECT p.id_pais,p.nombre_corto||' - '||p.nombre AS nombre
                                            FROM pais p `);

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


const getDepartamento = async (req, res) => { 
	try {

        const { selectedPaisId } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute("SELECT * FROM departamento WHERE id_pais = ?", [selectedPaisId]);
        

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


const getCiudad = async (req, res) => { 
	try {
        const { selectedDepaId } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute("SELECT * FROM ciudad c WHERE c.id_departamento = ?", [selectedDepaId]);

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
const setPista = async (req, res) => {
	let conexion = null; // Inicializar la conexión como null
	try {
		// Obtener los datos del cuerpo de la solicitud
		const {
			nombre,
            terrenoId,
            paisId,
            departamentoId,
            ciudadId
		} = req.body;

		// Obtener la conexión a la base de datos
		conexion = await connectDatabase();

		// Ejecutar la consulta SQL
		await conexion.execute(
			`INSERT INTO pistas (nombre,id_terreno,id_pais,id_departamento,id_ciudad) 
		VALUES (?, ?, ?, ?, ?)`,
			[
				nombre,
                terrenoId,
                paisId,
                departamentoId,
                ciudadId
			]
		);

		// Devolver una respuesta de éxito
		res.json({
			success: true,
			message: "Pista creada exitosamente",
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


const getPista = async (req, res) => { 
	try {

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute(`SELECT p.id_pista,p.nombre,
                                            t.nombre AS terreno,
                                            p2.nombre AS pais,
                                            d.nombre AS departamento,
                                            c.nombre AS ciudad
                                            FROM pistas p 
                                            INNER JOIN terrenos t ON t.id_terreno = p.id_terreno 
                                            INNER JOIN pais p2 ON p2.id_pais = p.id_pais 
                                            INNER JOIN departamento d ON d.id_departamento = p.id_departamento 
                                            INNER JOIN ciudad c ON c.id_ciudad = p.id_ciudad`);
        

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



const getPistaId = async (req, res) => { 
	try {
        const { id } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute("SELECT * FROM pistas WHERE id_pista = ?", [id]);

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



const updatePista = async (req, res) => {
    let conexion = null;
    try {
		const {
            idPista,
			nombre,
            terrenoId,
            paisId,
            departamentoId,
            ciudadId
		} = req.body;

        conexion = await connectDatabase();

        await conexion.execute(`UPDATE pistas 
								set nombre = ?,
								id_terreno = ?,
								id_pais = ?,
								id_departamento = ?,
								id_ciudad = ?
								WHERE id_pista = ?`, [nombre, terrenoId,paisId,departamentoId,ciudadId,idPista]);

        res.json({
            success: true,
            message: "Datos actualizado correctamente",
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


const deletePista = async (req, res) => {
    const id = parseInt(req.params.id);
    let conexion = null;
    try {
        conexion = await connectDatabase();

        await conexion.execute('DELETE FROM pistas WHERE id_pista = ?', [id]);

        res.json({
            success: true,
            message: "Dato eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar el registro:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar en la base de datos",
        });
    } finally {
        if (conexion) {
            await conexion.end();
        }
    }
};

// Exportar el controlador
module.exports = { getTerreno,getPais,getDepartamento,getCiudad,setPista,getPista,getPistaId,updatePista,deletePista };
