//import s3 from '../security/conexionS3'
const s3 = require('../security/conexionS3')

const getSignedImageUrl = async (req, res) => {
    const { path } = req.query;

    const params = {
        Bucket: 'MotoRacing01',
        Key: path,
        //Expires: 60,
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise('getObject', params);
        return res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error('Error al generar el enlace de la imagen:', error);
        return res.status(500).json({ error: 'Error al generar el enlace de la imagen' });
    }
};

const getSignedImagesUrls = async (req, res) => {
    const { folderPath } = req.query; // Ruta de la carpeta

    const params = {
        Bucket: 'MotoRacing01',
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
        console.error('Error al generar los enlaces de las imágenes:', error);
        return res.status(500).json({ error: 'Error al generar los enlaces de las imágenes' });
    }
};

const uploadFile = async (req, res) => {
    const { file } = req; 
    const params = {
        Bucket: 'MotoRacing01',
        Key: file.originalname, 
        Body: file.buffer, 
        ContentType: file.mimetype,
    };

    try {
        const data = await s3.upload(params).promise();
        return res.status(200).json({ message: 'Archivo subido con éxito', data });
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        return res.status(500).json({ error: 'Error al subir el archivo' });
    }
};

const getSignedUrlForImage = async (key) => {
    const params = {
        Bucket: 'MotoRacing01',
        Key: key,
        // Expires: 60, // Puedes ajustar el tiempo de expiración
    };

    try {
        // Generar enlace firmado para la imagen
        const signedUrl = await s3.getSignedUrlPromise('getObject', params);
        return signedUrl;
    } catch (error) {
        console.error('Error al generar el enlace de la imagen:', error);
        throw new Error('Error al generar el enlace de la imagen');
    }
};

module.exports ={
    getSignedImageUrl,
    //uploadFile,
    getSignedImagesUrls
};