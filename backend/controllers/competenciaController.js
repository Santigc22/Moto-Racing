const connectDatabase = require("../security/conexion");
const CryptoJS = require("crypto-js");
const Joi = require("joi");


const competenciaValidateInsert = Joi.object({
    nombre: Joi.string().max(255).required(),
    descripcion: Joi.string().max(255).required(),
    extra_por_patrocinio: Joi.number().required()
})

const competenciaValidateUpdate = Joi.object({
    nombre: Joi.string().max(255),
    descripcion: Joi.string().max(255),
    extra_por_patrocinio: Joi.number(),
});

const getAllCompetecias = async (req, res) => {
    try {
        const conexion = await connectDatabase();
        const [compe] = await conexion.execute(`SELECT c.* FROM competencia c WHERE c.estado = 1`)

        if (compe) {
            res.status(200).json({
                competencias: compe,
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
            message: "Error al obtener las competiciones",
            error: error.message
        })
    }
}

const createCompetencia = async (req, res) => {
    try {
        //Validar datos
        const { error, value } = competenciaValidateInsert.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Parámetros inválidos",
                error: error.details[0].message
            });
        }
        //Verificar que no haya una creada
        const { nombre, descripcion,extra_por_patrocinio} = value
        const conexion = await connectDatabase();
        const [validate] = await conexion.execute('SELECT c.nombre FROM competencia c WHERE c.nombre = ?',[nombre])
        if (validate.length > 0) {
            conexion.end
            return res.status(409).json({
                success: false,
                message: "La competencia ya existe."
            });
        }
        //Crear competencia
        const [create] = await conexion.execute('INSERT INTO competencia (nombre, descripcion, extra_por_patrocinio) VALUES(?,?,?)',[nombre,descripcion,extra_por_patrocinio])
        res.status(201).json({
            success: true,
            message: "Competencia creada satisfactoriamente.",
            id: create.insertId
        });
        await conexion.end();

    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Error crear la competicion",
            error: error.message
        })
    }
}

const updateCompetencia = async (req, res) => {
    try {
        const { competencia_id } = req.params;
        const { error, value } = competenciaValidateUpdate.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Datos inválidos.",
                error: error.details[0].message
            });
        }

        const conexion = await connectDatabase();
        const [competencia] = await conexion.execute('SELECT * FROM competencia WHERE id_competencia = ?', [competencia_id]);

        if (competencia.length === 0) {
            await conexion.end();
            return res.status(404).json({
                success: false,
                message: "La competencia no existe."
            });
        }

        const updates = value;
        const fieldsToUpdate = [];
        const params = [];

        if (updates.nombre) {
            const [existingCompetencia] = await conexion.execute(
                'SELECT * FROM competencia WHERE nombre = ? AND id_competencia != ?',
                [updates.nombre, competencia_id]
            );

            if (existingCompetencia.length > 0) {
                await conexion.end();
                return res.status(409).json({
                    success: false,
                    message: "Este nombre ya se encuentra en uso."
                });
            }
        }

        for (const key in updates) {
            if (updates[key] !== undefined) {
                fieldsToUpdate.push(`${key} = ?`);
                params.push(updates[key]);
            }
        }

        if (fieldsToUpdate.length > 0) {
            params.push(competencia_id);
            const query = `UPDATE competencia SET ${fieldsToUpdate.join(', ')} WHERE id_competencia = ?`;

            await conexion.execute(query, params);

            res.status(200).json({
                success: true,
                message: "Competencia actualizada satisfactoriamente.",
                id: competencia_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: "No se proporcionaron campos para actualizar"
            });
        }

        await conexion.end();
    } catch (error) {
        res.status(409).json({
            success: false,
            message: "Error al actualizar la competencia",
            error: error.message
        });
    }
};

const deleteCompetencia = async (req, res) => {
    try {
        const { competencia_id } = req.params;

        const conexion = await connectDatabase();
        await conexion.execute('UPDATE competencia SET estado = 0 WHERE id_competencia = ?',[competencia_id])
        res.status(200).json({
            success: true,
            message: "Competencia eliminada satisfactoriamente.",
            id: competencia_id
        });
        await conexion.end();

    } catch (error) {
        res.status(409).json({
            success: false,
            message: "Error al deshabilitar la competencia",
            error: error.message
        });
    }
}

module.exports = {
    getAllCompetecias,
    createCompetencia,
    updateCompetencia,
    deleteCompetencia
};