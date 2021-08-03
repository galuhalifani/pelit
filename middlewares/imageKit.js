const axios = require("axios");
const FormData = require("form-data");
const Buffer = require("buffer").Buffer;

function imageKit(req, res, next) {
  // if (
  //   req.file.mimetype !== "image/png" &&
  //   req.file.mimetype !== "image/jpeg"
  // ) {
  //   next({
  //     statusCode: 400,
  //     message: "Your image file should be in PNG or JPEG type",
  //   });
  // }
  // if (req.file.size > 255000) {
  //   next({
  //     statusCode: 400,
  //     message: "Your image file should be not more than 255 KB",
  //   });
  // }
  if (!req.file) next();
  else {
    let api_key = Buffer.from(`${process.env.PRIVATE_KEY}:`, "utf-8").toString(
      "base64"
    );
    const data = new FormData();
    data.append("file", req.file.buffer.toString("base64"));
    data.append("fileName", req.file.originalname);

    axios({
      url: "https://upload.imagekit.io/api/v1/files/upload",
      method: "post",
      headers: {
        Authorization: `Basic ${api_key}`,
        ...data.getHeaders(),
      },
      data: data,
    })
      .then((result) => {
        req.urlImage = result.data.url;
        next();
      })
      .catch((err) => {
        // console.log("ini error di image kit");
        // res.status(500).json({ message: "Error di imagekit" });
      });
  }
}

module.exports = imageKit;
