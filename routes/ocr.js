const express = require("express");
const router = express.Router();
const OCRController = require("../controllers/ocrController");
var timeout = require('connect-timeout')
// const extendTimeoutMiddleware = require("../middlewares/extendTimeout");
// const imageKit = require("../middlewares/imageKit");

const multer = require("multer");
const upload = multer();

// router.post('/', OCRController.postOcr)
router.use(timeout('60s'))
router.post(
  "/",
  upload.single("receiptImage"),
  haltOnTimedout,
  // imageKit,
  // extendTimeoutMiddleware,
  OCRController.postOcr
);

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

module.exports = router;
