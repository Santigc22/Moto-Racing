const express = require("express");
const competenciaRouter = express.Router();

const {
    getAllCompetecias,
    createCompetencia,
    updateCompetencia,
    deleteCompetencia
} = require('../controllers/competenciaController')

competenciaRouter.get("/", getAllCompetecias);
competenciaRouter.post("/", createCompetencia);
competenciaRouter.patch("/:competencia_id",updateCompetencia);
competenciaRouter.delete("/:competencia_id",deleteCompetencia);

module.exports = competenciaRouter;
