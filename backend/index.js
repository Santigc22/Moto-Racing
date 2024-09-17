const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
	res.setHeader("Content-type", "text/html");
	res.send(
		'<!DOCTYPE html><html><head><title>elegaNNza</title></head><body style="background-color:#2A7AA2; color:#ffffff;text-align:center;font-size:30px"><h1>Bienvenido a Moto Racing </h1><p>Api desarrollada en Nodejs</p></body></html>'
	);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor iniciado en el puerto http:/localhost:${PORT}`);
});


