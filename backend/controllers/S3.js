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

module.exports ={
    getSignedImageUrl,
    uploadFile
};