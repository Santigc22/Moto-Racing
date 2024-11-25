const express = require("express");
const patrociniosRouter = express.Router();

// Importar el controlador
const {
	partesPilotoPatrocinio,
	createPatrocinioPiloto,
	partesEquipoPatrocinio,
	createPatrocinioEquipo,
	getPatrociniosUsuario,
	getPatrociniosPatrocinador,
	get_partes_equipo,
	modificar_partes_equipo,
	modificar_partes_piloto,
	get_partes_piloto,
} = require("../controllers/patrocinios_controller");

// Rutas

patrociniosRouter.get("/partes_piloto/:id_piloto", partesPilotoPatrocinio);

patrociniosRouter.post("/create_patrocinio_piloto", createPatrocinioPiloto);

patrociniosRouter.get("/partes_equipo/:id_equipo", partesEquipoPatrocinio);

patrociniosRouter.post("/create_patrocinio_equipo", createPatrocinioEquipo);

patrociniosRouter.get("/patrocinios_usuario", getPatrociniosUsuario);

patrociniosRouter.get("/patrocinios_equipo", getPatrociniosPatrocinador);

patrociniosRouter.get("/partes_equipo_usuario", get_partes_equipo);

patrociniosRouter.get("/partes_piloto_usuario", get_partes_piloto);

patrociniosRouter.patch("/modificar_partes_equipo", modificar_partes_equipo);

patrociniosRouter.patch("/modificar_partes_piloto", modificar_partes_piloto);

module.exports = patrociniosRouter;
