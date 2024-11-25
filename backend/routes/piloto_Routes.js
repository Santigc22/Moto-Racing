const express = require("express");
const router = express.Router();

const {
	setPiloto,
	getPilotos,
	getPilotoById,
	updatePiloto,
	estadoPiloto,
} = require("../controllers/pilotoController");
router.post("/setPiloto", setPiloto);
router.get("/getPilotos", getPilotos);
router.post("/getPilotoById", getPilotoById);
router.post("/updatePiloto", updatePiloto);
router.post("/updateEstadoPiloto/:id", estadoPiloto);

module.exports = router;
