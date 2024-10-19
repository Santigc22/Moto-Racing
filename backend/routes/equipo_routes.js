const express = require("express");
const equiposRouter = express.Router();

// Importar controladores
const {
    getTeams,
    getTeam
} = require("../controllers/equipoController");

// Ruta para obtener equipos
equiposRouter.get("/", getTeams);

// Ruta para obtener un equipo especifico por path param (id)
equiposRouter.get("/:equipo_id", getTeam);

module.exports = equiposRouter;
