const express = require("express");
const router = express.Router();
const multer = require("multer"); // Importar multer
const storage = multer.memoryStorage();
const upload = multer({ storage });
const {
	getSignedImageUrl,
	getSignedImagesUrls,
	uploadFile,
	getImageForuser,
} = require("../controllers/S3");

router.get("/", getSignedImageUrl);
//localhost:3000/s3/?path=equipos/gx.png

router.get("/folder", getSignedImagesUrls);
//localhost:3000/s3/folder?folderPath=equipos

router.post("/upload/:id_area", upload.single("image"), uploadFile);

router.get("/user/:id_image", getImageForuser);

module.exports = router;
