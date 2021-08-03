const { User, Badge, Target, Transaction } = require("../models");
const { passwordHash } = require("../helpers/passwordBcrypt");

class UserController {
  static getOneUser(req, res) {
    let userId = +req.params.userId;
    User.findOne({
      where: { id: userId },
      include: [Badge, Target, Transaction],
    })
      .then((user) => {
        if (user) {
          let totalExpense = 0;
          let totalIncome = 0;
          for (let i = 0; i < user.Transactions.length; i++) {
            if (user.Transactions[i].type == "Expense") {
              totalExpense += user.Transactions[i].amount;
            } else {
              totalIncome += user.Transactions[i].amount;
            }
          }

          let result = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            firstName: user.fullName.split(" ")[0],
            photoProfile: user.photoProfile,
            balance: user.balance,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            pushToken: user.pushToken,
            Badges: user.Badges,
            Targets: user.Targets,
            Transactions: {
              totalExpense,
              totalIncome,
              data: user.Transactions,
            },
          };
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: "user not found" });
        }
      })
      .catch((err) => {
        // res.status(500).json(err)
      });
  }

  static patchBalanceUser(req, res) {
    const { balance } = req.body;
    const id = req.params.userId;
    User.update({ balance: +balance }, { where: { id } })
      .then((user) => {
        res.status(200).json({
          message: "Balance has been updated successfully",
          balance: +balance,
        });
      })
      .catch((err) => {
        // res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static patchPhotoProfileUser(req, res) {
    const { photoProfile } = req.body;
    const id = req.params.userId;
    User.update({ photoProfile }, { where: { id } })
      .then((user) => {
        res.status(200).json({
          message: "Photo profile has been updated successfully",
          photoProfile,
        });
      })
      .catch((err) => {
        // res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static patchEmailUser(req, res) {
    const { email } = req.body;
    const id = req.params.userId;
    User.update({ email }, { where: { id } })
      .then((user) => {
        res.status(200).json({
          message: "Email has been updated successfully",
          email,
        });
      })
      .catch((err) => {
        // res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static patchPasswordUser(req, res) {
    const { password } = req.body;
    const id = req.params.userId;
    User.update({ password: passwordHash(password) }, { where: { id } })
      .then((user) => {
        res.status(200).json({
          message: "Password has been updated successfully",
        });
      })
      .catch((err) => {
        // res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static patchFullNameUser(req, res) {
    const { fullName } = req.body;
    const id = req.params.userId;
    User.update({ fullName }, { where: { id } })
      .then((user) => {
        res.status(200).json({
          message: "Full name has been updated successfully",
          fullName,
        });
      })
      .catch((err) => {
        // res.status(500).json({ message: "Internal Server Error" });
      });
  }

  static patchPushTokenUser(req, res) {
    const {pushToken} = req.body
    const id = req.params.userId;
    User.update({ pushToken }, { where: { id } })
    .then(() => {
      res.status(200).json({
        message: "Updated pushToken"
      })
    })
  }
}

module.exports = UserController;
