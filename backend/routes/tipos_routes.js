const express = require("express");
const TiposRouter = express.Router();

// Importar el controlador
const {
	tipo_identificacion,
	tipo_usuario,
	tipo_sangre,
	pais,
	departamento,
	ciudad,
	competencias,
	categoria_carrera,
} = require("../controllers/tipos_controller");

// Ruta para obtener tipos de identificacion
TiposRouter.get("/tipo_identificacion", tipo_identificacion);
TiposRouter.get("/tipo_usuario", tipo_usuario);
TiposRouter.get("/tipo_sangre", tipo_sangre);
TiposRouter.get("/pais", pais);
TiposRouter.get("/departamento/:id_pais", departamento);
TiposRouter.get("/ciudad/:id_departamento", ciudad);
TiposRouter.get("/competencias", competencias);
TiposRouter.get("/categoria_carrera", categoria_carrera);

module.exports = TiposRouter;
