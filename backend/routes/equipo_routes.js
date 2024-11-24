const express = require("express");
const equiposRouter = express.Router();

// Importar controladores
const {
    getTeams,
    getTeam,
    registerTeam,
    updateTeam
} = require("../controllers/equipoController");

// Ruta para obtener equipos
equiposRouter.get("/", getTeams);

// Ruta para obtener un equipo especifico por path param (id)
equiposRouter.get("/:equipo_id", getTeam);

// Ruta para registrar un nuevo equipo
equiposRouter.post("/", registerTeam);

// Ruta para actualizar un campo o varios de un equipo
equiposRouter.patch("/:equipo_id", updateTeam);

module.exports = equiposRouter;
