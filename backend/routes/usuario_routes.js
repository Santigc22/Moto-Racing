const express = require("express");
const router = express.Router();

// Importar el controlador
const { getUsers, setUsers } = require("../controllers/usuarioController");

const { cookieJwtAuthGeneral } = require("../security/AuthMiddleware");

// Ruta para obtener usuarios
router.post("/login", getUsers);

// Ruta para crear usuarios
router.post("/setUser", setUsers);

module.exports = router;
