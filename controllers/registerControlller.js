const { User } = require("../models");

class RegisterController {
  static registerPost(req, res, next) {
    const { email, password, fullName, balance } = req.body;
    console.log({ email, password, fullName, balance });
    console.log(req.urlImage, "ini url image");
    console.log(
      {
        photoProfile:
          req.urlImage ||
          "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      },
      "ini photo"
    );
    User.create({
      email,
      password,
      fullName,
      balance: +balance || 0,
      photoProfile:
        req.urlImage ||
        "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
    })
      .then((user) => {
        res.status(201).json({
          data: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          },
          message: "Registered Successfully",
        });
      })
      .catch((err) => {
        let errors = [];
        if (
          err.name === "SequelizeUniqueConstraintError" ||
          err.name === "SequelizeValidationError"
        ) {
          errors = err.errors.map((e) => e.message);
          res.status(400).json({ message: errors });
        } else {
          // res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }
}

module.exports = RegisterController;
