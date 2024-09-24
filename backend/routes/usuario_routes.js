const express = require("express");
const router = express.Router();

// Importar el controlador
const { getUsers } = require("../controllers/usuarioController");

// Ruta para obtener usuarios
router.get("/", getUsers);

module.exports = router;
