const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const connectDatabase = require("./security/conexion");
const app = express();
const multer = require("multer");
const usuarioRoutes = require("./routes/usuario_routes");
const pistaRoutes = require("./routes/pista_routes");
const s3 = require("./routes/S3");
const tiposRouter = require("./routes/tipos_routes");
const patrociniosRouter = require("./routes/patrocinios_routes");
const motosRoutes = require("./routes/motos_routes");
const competenciaRouter = require("./routes/competencia_routes");
const carrerasRouter = require("./routes/carreras_routes");
const pilotosRouter = require("./routes/piloto_routes");
// Configurar el almacenamiento de Multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Directorio donde se guardarán los archivos subidos
	},
	filename: (req, file, cb) => {
		// Cambia el nombre del archivo para evitar colisiones
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

// Crear el middleware de Multer
const upload = multer({ storage: storage });
// const conectarDB = require("./security/conexionMongo");

const equiposRouter = require("./routes/equipo_routes");

app.use(express.json());

const corsOptions = {
	origin: ["http://localhost:3000", "https://moto-racing-ui.onrender.com"], // Orígenes permitidos
};
app.use(cors(corsOptions));
app.get("/", async (req, res) => {
	// const conexion = await connectDatabase();
	// console.log(conexion);
	res.setHeader("Content-type", "text/html");
	res.send(
		'<!DOCTYPE html><html><head><title>MotoRacing</title></head><body style="background-color:#2A7AA2; color:#ffffff;text-align:center;font-size:30px"><h1>Bienvenido a Moto Racing </h1><p>Api desarrollada en Nodejs</p></body></html>'
	);
});

app.use("/tipos", tiposRouter);
app.use("/patrocinios", patrociniosRouter);
app.use("/usuarios", usuarioRoutes);
app.use("/pista", pistaRoutes);
app.use("/pilotos", pilotosRouter);
app.use("/s3", s3);
app.use("/equipos", equiposRouter);
app.use("/motos", motosRoutes);
app.use("/competencia", competenciaRouter);
app.use("/carreras", carrerasRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`);
});
