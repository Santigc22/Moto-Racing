const express = require("express");
const carreraRouter = express.Router();

const {
    getCarreras,
    getOneCarrera,
    createCarrera,
    updateCarrera,
    deleteCarrera,
    traerCorredores,
    inscribirCorredor
} = require('../controllers/carrerasController')

carreraRouter.get("/", getCarreras);
carreraRouter.get("/:carrera_id", getOneCarrera);
carreraRouter.post('/', createCarrera)
carreraRouter.patch("/:carrera_id", updateCarrera);
carreraRouter.delete('/:carrera_id',deleteCarrera);
carreraRouter.get("/corredores/:carrera_id", traerCorredores);
carreraRouter.post("/corredores", inscribirCorredor);


module.exports = carreraRouter;