const express = require("express");
const router = express.Router();

// Importar el controlador
const { getUsers, setUsers } = require("../controllers/usuarioController");

// Ruta para obtener usuarios
router.post("/getUserLogin", getUsers);
router.post("/setUser", setUsers);

module.exports = router;
