const express = require("express");
const router = express.Router();
const OCRController = require("../controllers/ocrController");
// const extendTimeoutMiddleware = require("../middlewares/extendTimeout");
// const imageKit = require("../middlewares/imageKit");

const multer = require("multer");
const upload = multer();

// router.post('/', OCRController.postOcr)

router.post(
  "/",
  upload.single("receiptImage"),
  // imageKit,
  // extendTimeoutMiddleware,
  OCRController.postOcr
);

module.exports = router;
