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
        // Obtener los valores de los query parameters (opcionales)
        const { teamName = '', teamOwner = '' } = req.query;

        // Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

        // Consulta base
        let query = `
            SELECT equipo.id, equipo.nombre, CONCAT(usuario.nombre, ' ', usuario.apellido) AS representante_nombre, attachment.path AS logo_path, equipo.extra_por_patrocinio
            FROM equipo
            LEFT JOIN usuario ON equipo.representante_id = usuario.id
            LEFT JOIN attachment ON equipo.logo_id = attachment.id
        `;

        let params = [];
        let filters = [];

        // Añadir un filtro si existen los parámetros de filtro
        if (teamName) {
            filters.push(`equipo.nombre LIKE ?`);
            params.push(`%${teamName}%`);
        }

        if (teamOwner) {
            filters.push(`CONCAT(usuario.nombre, ' ', usuario.apellido) LIKE ?`);
            params.push(`%${teamOwner}%`);
        }

        // Si hay filtros, añadir el filtrado a la consulta
        if (filters.length > 0) {
            query += ` WHERE ` + filters.join(' AND ');
        }

        // Realizar la consulta a la base de datos
        const [rows] = await conexion.execute(query, params);

        res.status(200).json({
            equipos: rows,
        });

        // Cerrar conexión bd una vez hecha la consulta
        await conexion.end();
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Error al obtener los equipos",
            error: error.message
        })
    }
};

// Exportar controladores
module.exports = { getTeams };
