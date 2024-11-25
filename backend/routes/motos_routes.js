const express = require("express");
const router = express.Router();

// Importar el controlador
const { setMotos,getpiloto,getMotos,estadoMoto,getMotoId,updateMoto, getMarca, getModeloMoto, getSeguros, 
    getModeloId
} = require("../controllers/motoController");

// Ruta para obtener usuarios
router.post("/setMotos", setMotos);

router.get("/getPilotos",getpiloto)
router.get("/getMotos",getMotos)
router.post('/updateEstado/:id',  estadoMoto   );
router.post('/motoId',  getMotoId   );
router.post('/updateMoto',  updateMoto   );
router.get('/getMarca',  getMarca   );
router.post('/getModeloMoto',  getModeloMoto  );
router.get('/getSeguros',  getSeguros  );
router.post('/getModeloId',  getModeloId  );

module.exports = router;
