const express = require("express");
const router = express.Router();

// Importar el controlador
const { getTerreno,getPais,getDepartamento,getCiudad,setPista,getPista,getPistaId,updatePista,deletePista } = require("../controllers/pistaController");

// Ruta para obtener usuarios
router.get("/getTerreno", getTerreno);
router.get("/getPais", getPais);
router.post("/getDepartamento", getDepartamento);
router.post("/getCiudad", getCiudad);
router.post("/setPista", setPista);
router.get("/getPista", getPista);
router.post("/pistaId", getPistaId);
router.post("/updatePista", updatePista);
router.delete('/deletePista/:id',  deletePista);

module.exports = router;
