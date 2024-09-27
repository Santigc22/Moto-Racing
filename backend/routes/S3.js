const express = require("express");
const router = express.Router();

const {getSignedImageUrl} = require('../controllers/S3')

router.get("/", getSignedImageUrl)

module.exports = router;