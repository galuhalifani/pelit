const Controller = require("../controllers/registerControlller");
const router = require("express").Router();

const imageKit = require("../middlewares/imageKit");

const multer = require("multer");
const upload = multer();

router.post(
  "/",
  upload.single("photoProfile"),
  imageKit,
  Controller.registerPost
);

module.exports = router;
