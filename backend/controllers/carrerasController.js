const connectDatabase = require("../security/conexion");
const CryptoJS = require("crypto-js");
const Joi = require("joi");

const CarreraSchema = Joi.object({
    nombre: Joi.string().max(255).required(),
    fecha: Joi.date().required(),
    hora: Joi.time().require(),
    competidores: Joi.string().max(2).required(),
    vueltas: Joi.string().max(2).required(),
    categoria: Joi.string().max(5).required(),
    pista: Joi.string().max(5).required(),
    competecia: Joi.string().max(2).required(),
});

//Funcion para obtener todas las carreras
const getCarreras = async () =>{
    try {
        
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Error al obtener los corredores",
            error: error.message
        })
    }
}

module.exports = { getCarreras};
