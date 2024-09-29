const express = require("express");
const router = express.Router();

const {getSignedImageUrl, getSignedImagesUrls} = require('../controllers/S3')

router.get("/", getSignedImageUrl)
http://localhost:3000/s3/?path=equipos/gx.png
router.get("/folder", getSignedImagesUrls)
http://localhost:3000/s3/folder?folderPath=equipos

module.exports = router;