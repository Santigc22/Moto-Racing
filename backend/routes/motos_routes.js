const express = require("express");
const router = express.Router();

// Importar el controlador
const { setMotos,getpiloto,getMotos,deleteMoto,getMotoId } = require("../controllers/motoController");

// Ruta para obtener usuarios
router.post("/setMotos", setMotos);

router.get("/getPilotos",getpiloto)
router.get("/getMotos",getMotos)
router.delete('/delete/:id',  deleteMoto   );
router.post('/motoId',  getMotoId   );

module.exports = router;
