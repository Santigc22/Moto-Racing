//import s3 from '../security/conexionS3'
const s3 = require("../security/conexionS3");
const connectDatabase = require("../security/conexion");
const getSignedImageUrl = async (req, res) => {
	const { path } = req.query;

	const params = {
		Bucket: "MotoRacing01",
		Key: path,
		//Expires: 60,
	};

	try {
		const signedUrl = await s3.getSignedUrlPromise("getObject", params);
		return res.status(200).json({ url: signedUrl });
	} catch (error) {
		console.error("Error al generar el enlace de la imagen:", error);
		return res
			.status(500)
			.json({ error: "Error al generar el enlace de la imagen" });
	}
};

const getSignedImagesUrls = async (req, res) => {
	const { folderPath } = req.query; // Ruta de la carpeta

	const params = {
		Bucket: "MotoRacing01",
		Prefix: folderPath, // Ruta de la carpeta en el bucket
	};

	try {
		// Obtener todos los objetos dentro de la carpeta
		const data = await s3.listObjectsV2(params).promise();

		// Generar enlaces firmados para cada imagen
		const signedUrls = await Promise.all(
			data.Contents.map(async (item) => {
				return await getSignedUrlForImage(item.Key);
				//console.log(item.Key)
			})
		);

		return res.status(200).json({ urls: signedUrls });
	} catch (error) {
		console.error("Error al generar los enlaces de las imágenes:", error);
		return res
			.status(500)
			.json({ error: "Error al generar los enlaces de las imágenes" });
	}
};

const getSignedUrlForImage = async (key) => {
	const params = {
		Bucket: "MotoRacing01",
		Key: key,
		// Expires: 60, // Puedes ajustar el tiempo de expiración
	};

	try {
		// Generar enlace firmado para la imagen
		const signedUrl = await s3.getSignedUrlPromise("getObject", params);
		return signedUrl;
	} catch (error) {
		console.error("Error al generar el enlace de la imagen:", error);
		throw new Error("Error al generar el enlace de la imagen");
	}
};

async function getImageForuser(req, res) {
	try {
		const id_image = req.params.id_image;

		// Verificar si se proporcionó un ID de imagen
		if (!id_image) {
			return res
				.status(400)
				.json({ error: "No se ha proporcionado el ID de la imagen" });
		}

		// Conectar a la base de datos
		const conexion = await connectDatabase();

		// Consulta para obtener los datos de la imagen
		const query = `SELECT * FROM attachment WHERE id = ?`;
		const [data] = await conexion.query(query, [id_image]);

		// Verificar si se encontró la imagen
		if (!data.length) {
			return res.status(404).json({ error: "No se ha encontrado la imagen" });
		}

		const path = data[0].path;

		// Configuración de parámetros para obtener la URL firmada
		const params = {
			Bucket: "MotoRacing01",
			Key: path,
		};

		// Obtener la URL firmada
		const signedUrl = await s3.getSignedUrlPromise("getObject", params);

		// Enviar la URL como respuesta
		return res.status(200).json({ url: signedUrl });
	} catch (error) {
		console.error("Error al generar el enlace de la imagen:", error);
		return res
			.status(500)
			.json({ error: "Error al generar el enlace de la imagen" });
	}
}

const uploadFile = async (req, res) => {
	const conexion = await connectDatabase();
	const { id_area } = req.params; // Se obtiene el id del área de los parámetros de la ruta
	const image = req.file; // Obtener el archivo de la solicitud (uso de req.file)
	const fecha = new Date().toISOString().split("T")[0];

	const params = {
		Bucket: "MotoRacing01",
		Key: `${id_area}/${image.originalname}_${fecha}`, // Concatenar el ID del área para la carpeta
		Body: image.buffer,
		ContentType: image.mimetype,
	};

	try {
		// Subir archivo a S3
		const data = await s3.upload(params).promise();
		//cargar ruta a la base de datos tabla atachemn

		console.log(data);

		const query_insert_attachmen = `INSERT INTO attachment (path, nombre) VALUES ('${data.key}', '${image.originalname}_${fecha}')`;
		// console.log(query_insert_attachmen);

		const insertId = await conexion.query(query_insert_attachmen);
		console.log(insertId);

		return res.status(200).json({
			message: "Archivo subido con éxito",
			id_file_attacchment: insertId[0].insertId,
		});
	} catch (error) {
		console.error("Error al subir el archivo:", error);
		return res.status(500).json({ error: "Error al subir el archivo" });
	}
};
module.exports = {
	getSignedImageUrl,
	uploadFile,
	getSignedImagesUrls,
	getImageForuser,
};
