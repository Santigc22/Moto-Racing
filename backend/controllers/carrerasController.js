const connectDatabase = require("../security/conexion");
const CryptoJS = require("crypto-js");
const Joi = require("joi");

const CarreraSchema = Joi.object({
    nombre: Joi.string().max(255).required(),
    fecha: Joi.date().required(),
    hora: Joi.string().required(),
    max_competidores: Joi.string().max(2).required(),
    num_vueltas: Joi.string().max(2).required(),
    id_categoria: Joi.string().max(5).required(),
    id_pista: Joi.string().max(5).required(),
    id_competencia: Joi.string().max(2).required(),
    extra_por_patrocinio: Joi.string().max(2).required(),
});
const CarreraSchemaUpdate = Joi.object({
    nombre: Joi.string().max(255),
    fecha: Joi.date(),
    hora: Joi.string(),
    max_competidores: Joi.string().max(2),
    num_vueltas: Joi.string().max(2),
    id_categoria: Joi.string().max(5),
    id_pista: Joi.string().max(5),
    id_competencia: Joi.string().max(2),
    extra_por_patrocinio: Joi.string().max(2),
});

//Funcion para obtener todas las carreras
const getCarreras = async (req, res) => {
    try {
        const conexion = await connectDatabase();
        const [result] = await conexion.execute(`SELECT 
c.id,
c.nombre,
c.fecha,
c.hora,
c.max_competidores,
c.num_vueltas,
cc.cilindrada AS 'Categoria',
p.nombre AS 'Pista',
t.nombre AS 'Tipo de terreno',
co.nombre AS 'competencia'
FROM carrera c 
JOIN pistas p ON p.id_pista = c.id_pista
JOIN categoria_carrera cc ON cc.id = c.id_categoria
JOIN competencia co ON co.id_competencia = c.id_competencia
JOIN terrenos t ON t.id_terreno = p.id_terreno
WHERE c.status  <> 0;`)

        if (result) {
            res.status(200).json({
                Carreras: result,
            });
        } else {
            res.status(400).json({
                message: "Error en la consulta",
                error: error.message
            })
        }
        await conexion.end();

    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Error al obtener las carreras",
            error: error.message
        })
    }
}

const getOneCarrera = async (req, res) => {
    try {
        const { carrera_id } = req.params;

        const conexion = await connectDatabase();
        const query = `SELECT 
c.id,
c.nombre,
c.fecha,
c.hora,
c.max_competidores,
c.num_vueltas,
cc.cilindrada AS 'Categoria',
p.nombre AS 'Pista',
t.nombre AS 'Tipo de terreno',
co.nombre AS 'competencia'
FROM carrera c 
JOIN pistas p ON p.id_pista = c.id_pista
JOIN categoria_carrera cc ON cc.id = c.id_categoria
JOIN competencia co ON co.id_competencia = c.id_competencia
JOIN terrenos t ON t.id_terreno = p.id_terreno
WHERE c.status  <> 0 AND c.id = ?`
        const [result] = await conexion.execute(query, [carrera_id])

        if (result) {
            res.status(200).json({
                Carrera: result,
            });
        } else {
            res.status(400).json({
                message: "Error en la consulta",
                error: error.message
            })
        }
        await conexion.end();

    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Error al obtener la carrera",
            error: error.message
        })
    }
}

const createCarrera = async (req, res) => {
    try {
        const { error, value } = CarreraSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Parámetros inválidos",
                error: error.details[0].message
            });
        }
        const { nombre, fecha, hora, max_competidores, num_vueltas, id_categoria, id_pista, id_competencia, extra_por_patrocinio } = value

        const conexion = await connectDatabase();
        const [valNom] = await conexion.execute(`SELECT c.nombre FROM carrera c WHERE c.nombre = ? AND c.id_competencia = ?`, [nombre, id_competencia])
        if (valNom.length > 0) {
            conexion.end()
            return res.status(409).json({
                success: false,
                message: "La carrera ya existe."
            });
        }

        const [create] = await conexion.execute(`INSERT INTO carrera (nombre, fecha, hora, max_competidores, num_vueltas, id_categoria, id_pista, id_competencia, extra_por_patrocinio)
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, fecha, hora, max_competidores, num_vueltas, id_categoria, id_pista, id_competencia, extra_por_patrocinio])

        res.status(201).json({
            success: true,
            message: "Carrera creada satisfactoriamente.",
            id: create.insertId
        });
        await conexion.end();
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Error al obtener la carrera",
            error: error.message
        })
    }
}

const updateCarrera = async (req, res) => {
    try {
        const { carrera_id } = req.params;
        const { error, value } = CarreraSchemaUpdate.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos.",
                error: error.details[0].message
            });
        }

        const conexion = await connectDatabase();

        // Verificar si la carrera existe
        const [carrera] = await conexion.execute('SELECT * FROM carrera WHERE id = ?', [carrera_id]);
        if (carrera.length === 0) {
            await conexion.end();
            return res.status(404).json({
                success: false,
                message: "La carrera no existe."
            });
        }

        const updates = value;
        const fieldsToUpdate = [];
        const params = [];

        // Validar si el nombre ya existe en otra carrera
        if (updates.nombre) {
            const [existingCarrera] = await conexion.execute(
                'SELECT * FROM carrera WHERE nombre = ? AND id != ?',
                [updates.nombre, carrera_id]
            );

            if (existingCarrera.length > 0) {
                await conexion.end();
                return res.status(409).json({
                    success: false,
                    message: "Este nombre ya se encuentra en uso."
                });
            }
        }

        // Preparar los campos y valores para actualizar
        for (const key in updates) {
            if (updates[key] !== undefined) {
                fieldsToUpdate.push(`${key} = ?`);
                params.push(updates[key]);
            }
        }

        if (fieldsToUpdate.length > 0) {
            params.push(carrera_id);
            const query = `UPDATE carrera SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;

            await conexion.execute(query, params);

            res.status(200).json({
                success: true,
                message: "Carrera actualizada satisfactoriamente.",
                id: carrera_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: "No se proporcionaron campos para actualizar"
            });
        }

        await conexion.end();
    } catch (error) {
        console.error(error);
        res.status(409).json({
            success: false,
            message: "Error al actualizar la carrera",
            error: error.message
        });
    }
};

const deleteCarrera = async (req, res) => {
    const { carrera_id } = req.body;
    let conexion;

    try {
        conexion = await connectDatabase();

        // Verificar si la carrera existe
        const [carrera] = await conexion.execute(
            'SELECT c.* FROM carrera c WHERE id = ?',
            [carrera_id]
        );

        if (carrera.length === 0) {
            return res.status(404).json({
                success: false,
                message: "La carrera no existe."
            });
        }

        // Cambiar el estado a 0 (deshabilitar)
        await conexion.execute(
            'UPDATE carrera SET status = 0 WHERE id = ?',
            [carrera_id]
        );

        res.status(200).json({
            success: true,
            message: "carrera eliminada satisfactoriamente.",
            id: carrera_id
        });

    } catch (error) {
        console.error(error);
        res.status(409).json({
            success: false,
            message: "Error al deshabilitar la carrera",
            error: error.message
        });
    } finally {
        if (conexion) await conexion.end();
    }
};

const traerCorredores = async (req, res) => {
    try {
        //traer corredores
        const { carrera_id } = req.params;
        const conexion = await connectDatabase();

        const query = `SELECT 
p.id,
u.nombre,
u.apellido
FROM participantes p
JOIN usuario u ON u.id = p.piloto_id
WHERE p.carrera_id = ?`

        const [result] = await conexion.execute(query, [carrera_id])

        if (result) {
            res.status(200).json({
                Carrera: result,
            });
        } else {
            res.status(400).json({
                message: "Error en la consulta",
                error: error.message
            })
        }
        await conexion.end();

    } catch (error) {
        console.error(error);
        res.status(409).json({
            success: false,
            message: "Error al incribir en la carrera",
            error: error.message
        });
    }
}

const inscribirCorredor = async (req, res) => {
    const { carrera_id, piloto_id, moto_id } = req.body;
    let conexion;

    try {
        if (!carrera_id || !piloto_id || !moto_id) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios."
            });
        }
        // Conectar a la base de datos
        conexion = await connectDatabase();

        // Validar el número máximo de competidores
        const [carreras] = await conexion.execute(
            'SELECT c.max_competidores FROM carrera c WHERE c.id = ?', 
            [carrera_id]
        );

        if (carreras.length === 0) {
            return res.status(404).json({
                success: false,
                message: "La carrera no existe."
            });
        }

        const max_competidores = carreras[0].max_competidores;

        // Obtener el número de inscriptos actuales
        const [inscriptos] = await conexion.execute(
            'SELECT COUNT(p.piloto_id) AS n_participantes FROM participantes p WHERE p.carrera_id = ?', 
            [carrera_id]
        );

        const n_participantes = inscriptos[0].n_participantes;

        // Validar si hay cupo disponible
        if (n_participantes >= max_competidores) {
            return res.status(400).json({
                success: false,
                message: "No hay cupos disponibles para esta carrera."
            });
        }

        // Verificar si el piloto ya está inscrito en la carrera
        const [registroExistente] = await conexion.execute(
            'SELECT * FROM participantes WHERE carrera_id = ? AND piloto_id = ?', 
            [carrera_id, piloto_id]
        );

        if (registroExistente.length > 0) {
            return res.status(400).json({
                success: false,
                message: "El piloto ya está inscrito en esta carrera."
            });
        }

        // Inscribir al piloto
        await conexion.execute(
            'INSERT INTO participantes (carrera_id, piloto_id, moto_id) VALUES (?, ?, ?)', 
            [carrera_id, piloto_id, moto_id]
        );

        res.status(200).json({
            success: true,
            message: "El piloto ha sido inscrito con éxito.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al inscribir en la carrera",
            error: error.message
        });
    } finally {
        if (conexion) {
            conexion.end();
        }
    }
};


const quitarCorredor = async (req, res) => {
    const { carrera_id, piloto_id } = req.body;

    if (!carrera_id || !piloto_id) {
        return res.status(400).json({
            success: false,
            message: "Los campos 'carrera_id' y 'piloto_id' son obligatorios."
        });
    }

    let conexion;
    console.log(carrera_id)
    try {
        // Conectar a la base de datos
        conexion = await connectDatabase();

        // Verificar si el piloto está inscrito en la carrera
        const [registroExistente] = await conexion.execute(
            'SELECT * FROM participantes WHERE carrera_id = ? AND piloto_id = ?',
            [carrera_id, piloto_id]
        );

        if (registroExistente.length === 0) {
            return res.status(404).json({
                success: false,
                message: "El piloto no está inscrito en esta carrera."
            });
        }

        // Quitar al piloto de la carrera
        await conexion.execute(
            'DELETE FROM participantes WHERE carrera_id = ? AND piloto_id = ?',
            [carrera_id, piloto_id]
        );

        res.status(200).json({
            success: true,
            message: "El piloto ha sido eliminado de la carrera con éxito."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al quitar al piloto de la carrera.",
            error: error.message
        });
    } finally {
        if (conexion) {
            conexion.end();
        }
    }
};




module.exports = {
    getCarreras,
    getOneCarrera,
    createCarrera,
    updateCarrera,
    deleteCarrera,
    inscribirCorredor,
    quitarCorredor,
    traerCorredores,
    quitarCorredor
};
