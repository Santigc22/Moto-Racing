const express = require("express");
const patrociniosRouter = express.Router();

// Importar el controlador
const {
	partePatrocinio,
	insertPatrocinio,
} = require("../controllers/patrocinios_controller");

// Rutas
patrociniosRouter.get("/:entidad", partePatrocinio);

patrociniosRouter.post("/insert_patrocinios", insertPatrocinio);

module.exports = patrociniosRouter;
