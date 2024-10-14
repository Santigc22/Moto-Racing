// Importar la función para conectarse a la base de datos
const connectDatabase = require("../security/conexion");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const parametersTeam = Joi.object({
    nombre: Joi.string().max(255).required(),
    representante: Joi.number().required(),
    logo: Joi.number().required(),
    extra: Joi.number().required()
});

// Función para obtener equipos
const getTeams = async (req, res) => {
    try {
        // Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

        // Realizar la consulta a la bd
        const [rows] = await conexion.execute(
            `SELECT equipo.id, equipo.nombre, usuario.nombre AS representante_nombre, attachment.path AS logo_path, equipo.extra_por_patrocinio
            FROM equipo
            LEFT JOIN usuario ON equipo.representante_id = usuario.id
            LEFT JOIN attachment ON equipo.logo_id = attachment.id`
        );

        res.status(200).json({
            equipos: rows,
        });

        // Cerrar conexión bd una vez hecha la consulta
        await conexion.end();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error al obtener los equipos",
            error: error.message
        })
    }
};

// Exportar controladores
module.exports = { getTeams };
