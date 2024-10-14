const express = require("express");
const equiposRouter = express.Router();

// Importar controladores
const {
    getTeams,
} = require("../controllers/equipoController");

// Ruta para obtener equipos
equiposRouter.get("/equipos", getTeams);

module.exports = equiposRouter;
