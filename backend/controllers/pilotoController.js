// Importar la función para conectarse a la base de datos
const connectDatabase = require("../security/conexion");

// Obtener todos los pilotos
const getPilotos = async (req, res) => {
	try {
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute(`SELECT p.id, u.nombre||' '||u.apellido AS nombre, p.altura, p.alr, p.tipo_sangre_id
                                                FROM piloto p 
                                                INNER JOIN usuario u ON u.id = p.id`);

		res.json({
			success: true,
			response: rows			
		});

		await conexion.end();
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
};

// Obtener un piloto por su ID
const getPilotoById = async (req, res) => { 
	try {
        const { id } = req.body;

		// Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

		const [rows] = await conexion.execute("SELECT * FROM piloto WHERE id = ?", [id]);

		res.json({
			success: true,
			response: rows			
		});

		await conexion.end();
	} catch (error) {
		console.error("Error en la consulta:", error);
		res.status(500).json({
			success: false,
			message: "Error al consultar la base de datos",
		});
	}
};

// Crear un nuevo piloto
const setPiloto = async (req, res) => {
	let conexion = null;
	try {
		const { id, altura, alr, tipo_sangre_id } = req.body;

		conexion = await connectDatabase();

		await conexion.execute(
			`INSERT INTO piloto (id, altura, alr, tipo_sangre_id) 
		VALUES (?, ?, ?, ?)`,
			[id, altura, alr, tipo_sangre_id]
		);

		res.json({
			success: true,
			message: "Piloto creado exitosamente",
		});
	} catch (error) {
		console.error("Error al insertar el piloto:", error);
		res.status(500).json({
			success: false,
			message: "Error al insertar el piloto en la base de datos",
		});
	} finally {
		if (conexion) {
			await conexion.end();
		}
	}
};

// Actualizar un piloto
const updatePiloto = async (req, res) => {
    let conexion = null;
    try {
		const { id, altura, alr, tipo_sangre_id } = req.body;

        conexion = await connectDatabase();

        await conexion.execute(`UPDATE piloto 
								SET altura = ?, alr = ?, tipo_sangre_id = ?
								WHERE id = ?`, [altura, alr, tipo_sangre_id, id]);

        res.json({
            success: true,
            message: "Piloto actualizado correctamente",
        });
    } catch (error) {
        console.error("Error al actualizar el piloto:", error);
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

// Cambiar el estado de un piloto
const estadoPiloto = async (req, res) => {
    const id = parseInt(req.params.id);
    let conexion = null;
    try {
        conexion = await connectDatabase();

        await conexion.execute('UPDATE piloto SET estado = 0 WHERE id = ?', [id]);

        res.json({
            success: true,
            message: "Estado del piloto actualizado correctamente",
        });
    } catch (error) {
        console.error("Error al actualizar el estado del piloto:", error);
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

// Exportar el controlador de pilotos
module.exports = { setPiloto, getPilotos, getPilotoById, updatePiloto, estadoPiloto };
