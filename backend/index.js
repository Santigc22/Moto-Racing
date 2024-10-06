const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const connectDatabase = require("./security/conexion");
const app = express();
const usuarioRoutes = require("./routes/usuario_routes");
const s3 = require("./routes/S3");
const tiposRouter = require("./routes/tipos_routes");
app.use(express.json());

app.use(cors());

app.get("/", async (req, res) => {
	// const conexion = await connectDatabase();
	// console.log(conexion);
	res.setHeader("Content-type", "text/html");
	res.send(
		'<!DOCTYPE html><html><head><title>MotoRacing</title></head><body style="background-color:#2A7AA2; color:#ffffff;text-align:center;font-size:30px"><h1>Bienvenido a Moto Racing </h1><p>Api desarrollada en Nodejs</p></body></html>'
	);
});

app.use("/tipos", tiposRouter);

app.use("/usuarios", usuarioRoutes);
app.use("/s3", s3);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`);
});
