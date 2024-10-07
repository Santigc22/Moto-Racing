const express = require("express");
const router = express.Router();

// Importar el controlador
const { getUsers, setUsers, getUserInformation, updateUser } = require("../controllers/usuarioController");

const { cookieJwtAuthGeneral } = require("../security/AuthMiddleware");

// Ruta para obtener usuarios
router.post("/login", getUsers);

// Ruta para crear usuarios
router.post("/setUser", setUsers);

router.get("/info", getUserInformation)

router.put("/update", updateUser)

module.exports = router;
