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
        const { teamName = '', teamOwner = '', resultsPerPage = 10, page = 1 } = req.query;

        const limit = Number.isInteger(parseInt(resultsPerPage)) ? parseInt(resultsPerPage) : 10;
        const offset = Number.isInteger(parseInt(page)) ? (parseInt(page) - 1) * limit : 0;

        // Obtener la conexión a la base de datos
		const conexion = await connectDatabase();

        // Consulta base
        let query = `
            SELECT equipo.id, equipo.nombre, CONCAT(usuario.nombre, ' ', usuario.apellido) AS representante, attachment.path AS logo_path, equipo.extra_por_patrocinio
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

        // Añadir paginación a la consulta
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        // Realizar la consulta a la base de datos
        const [rows] = await conexion.execute(query, params);

        // Consulta para acomodar los resultados
        let countQuery = `
            SELECT COUNT(*) AS total 
            FROM equipo 
            LEFT JOIN usuario ON equipo.representante_id = usuario.id
            LEFT JOIN attachment ON equipo.logo_id = attachment.id
        `;

        let countParams = [...params.slice(0, filters.length)];

        if (filters.length > 0) {
            countQuery += ` WHERE ` + filters.join(' AND ');
        }

        // Realizar la consulta a la base de datos con los datos acomodados
        const [[{ total }]] = await conexion.execute(countQuery, countParams);

        res.status(200).json({
            equipos: rows,
            totalResults: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            resultsPerPage: limit,
        });

        // Cerrar conexión bd una vez hecha la consulta
        await conexion.end();
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Error al obtener los equipos",
            error: error.message
        })
    }
};

// Función para obtener un equipo en específico
const getTeam = async (req, res) => {
    try {
        // Captar el path param (id)
        const { equipo_id } = req.params;

        // Obtener conexión a la base de datos
        const conexion = await connectDatabase();

        // Consulta SQL para obtener el equipo por su id
        const [rows] = await conexion.execute(
            `SELECT equipo.id, equipo.nombre, CONCAT(usuario.nombre, ' ', usuario.apellido) AS representante_nombre, attachment.path AS logo_path, equipo.extra_por_patrocinio
             FROM equipo
             LEFT JOIN usuario ON equipo.representante_id = usuario.id
             LEFT JOIN attachment ON equipo.logo_id = attachment.id
             WHERE equipo.id = ?`, 
             [equipo_id]
        );

        // Si no se enceuntra, retornar NOT FOUND
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Equipo no encontrado"
            });
        }

        // Respuesta exitosa
        res.status(200).json({
            equipo: rows[0]
        });

        // Cerrar conexión a la base de datos
        await conexion.end();
    } catch (error) {
        //Respuesta negativa
        res.status(400).json({
            success: false,
            message: "Error al obtener el equipo",
            error: error.message
        });
    }
};

// Exportar controladores
module.exports = { getTeams, getTeam };
