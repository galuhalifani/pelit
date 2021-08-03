const { User, Badge, Target, Transaction } = require("../models");

class Controller {
  static getUserById(req, res) {
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
          res.status(404).json("user not found");
        }
      })
      .catch((err) => {
        // res.status(500).json(err)
      });
  }
}

module.exports = Controller;
