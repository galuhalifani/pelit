const { User, Badge, Target, Transaction } = require("../models");
const { comparePassword } = require("../helpers/passwordBcrypt");
const { generateJWT } = require("../helpers/jsonWebToken");

class LoginController {
  static loginPost(req, res, next) {
    const { email, password } = req.body;
    User.findOne({
      where: {
        email,
      },
      include: [Badge, Target, Transaction],
    })
      .then((user) => {
        if (user) {
          if (comparePassword(password, user.password)) {
            const access_token = generateJWT({
              id: user.id,
              email: user.id,
            });
            let totalExpense = 0;
            let totalIncome = 0;
            for (let i = 0; i < user.Transactions.length; i++) {
              if (user.Transactions[i].type == "Expense") {
                totalExpense += user.Transactions[i].amount;
              } else {
                totalIncome += user.Transactions[i].amount;
              }
            }
            res.status(200).json({
              access_token,
              data: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                firstName: user.fullName.split(" ")[0],
                photoProfile: user.photoProfile,
                balance: user.balance,
                Badges: user.Badges,
                Targets: user.Targets,
                Transactions: {
                  totalExpense,
                  totalIncome,
                  data: user.Transactions,
                },
              },
            });
          } else {
            res.status(401).json({ message: "Wrong Email/Password" });
          }
        } else {
          res.status(401).json({ message: "Wrong Email/Password" });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: "Internal Server Error" });
      });
  }
}

module.exports = LoginController;
