const express = require("express");
const patrociniosRouter = express.Router();

// Importar el controlador
const {
	partesPilotoPatrocinio,
	createPatrocinioPiloto,
} = require("../controllers/patrocinios_controller");

// Rutas

patrociniosRouter.get("/partes_piloto/:id_piloto", partesPilotoPatrocinio);

patrociniosRouter.post("/create_patrocinio_piloto", createPatrocinioPiloto);

module.exports = patrociniosRouter;
