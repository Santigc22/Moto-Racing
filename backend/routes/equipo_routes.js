const express = require("express");
const equiposRouter = express.Router();

// Importar controladores
const {
    getTeams,
    getTeam,
    registerTeam
} = require("../controllers/equipoController");

// Ruta para obtener equipos
equiposRouter.get("/", getTeams);

// Ruta para obtener un equipo especifico por path param (id)
equiposRouter.get("/:equipo_id", getTeam);

// Ruta para registrar un nuevo equipo
equiposRouter.post("/", registerTeam);

module.exports = equiposRouter;
