// Importar la función para conectarse a la base de datos
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

		const [rows] = await conexion.execute(`SELECT m.id,u.nombre||' '||u.apellido AS nombre,m.marca,m.modelo,m.soat
                                            FROM moto m 
                                            INNER JOIN usuario u ON u.id = m.propietario_id `);

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
            soat
		} = req.body;

		// Obtener la conexión a la base de datos
		conexion = await connectDatabase();

		// Ejecutar la consulta SQL
		await conexion.execute(
			`INSERT INTO moto (propietario_id, marca, modelo,soat) 
		VALUES (?, ?, ?, ?)`,
			[
				pilotoId,
                marca,
                modelo,
                soat
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

const deleteMoto = async (req, res) => {
    const id = parseInt(req.params.id);
    let conexion = null;
    try {
        conexion = await connectDatabase();

        await conexion.execute('DELETE FROM moto WHERE id = ?', [id]);

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
module.exports = { setMotos, getpiloto, getMotos, deleteMoto, getMotoId };
