const { Transaction, History, User } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

class TransactionController {
  // static async getAll(req, res) {
  //   const { category, type } = req.query;
  //   const { date, month, year } = +req.query;
  //   try {
  //     const data = await Transaction.findAll({
  //       where: { category, date, month, year, type },
  //     });
  //     res.status(200).json(data);
  //   } catch (error) {
  //     res.status(500).json({ message: error });
  //   }
  // }

  static getAllByUserId(req, res) {
    let userId = +req.params.UserId;

    Transaction.findAll({
      where: {
        UserId: userId,
      },
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        // res.status(500).json({ message: err });
      });
  }

  static getByType(req, res) {
    let userId = +req.params.UserId;
    let type = req.params.type;
    let month = +req.body.month;

    Transaction.findAll({
      where: {
        UserId: userId,
        month: month,
        type: type,
      },
    })
      .then((data) => {
        data.forEach((ele) => {
          ele.type === "Expense" ? (ele.amount *= -1) : null;
          return ele;
        });

        let total = 0;
        for (let i = 0; i < data.length; i++) {
          total += data[i].amount;
        }

        res.status(200).json({ total, data });
      })
      .catch((err) => {
        // res.status(500).json({ message: err });
      });
  }

  static getAllGroupedByCategory(req, res) {
    let userId = +req.params.UserId;
    let monthNum = +req.params.month;

    Transaction.findAll({
      where: {
        month: monthNum,
        UserId: userId,
      },
      order: ["category"],
    })
      .then((data) => {
        let group = [];
        let flag = true;
        data.forEach((ele) => {
          ele.type === "Expense" ? (ele.amount *= -1) : null;
          if (group.length > 0) {
            for (let i = 0; i < group.length; i++) {
              if (group[i].category == ele.category) {
                flag = true;
                group[i].total += ele.amount;
                group[i].items.push({
                  id: ele.id,
                  title: ele.title,
                  nameDate: `${ele.date} ${ele.fullDate.toLocaleString(
                    "default",
                    { month: "long" }
                  )}`,
                  type: ele.type,
                  title: ele.title,
                  amount: ele.amount,
                  date: ele.date,
                  month: ele.month,
                  year: ele.year,
                  fullDate: ele.fullDate,
                });
              } else {
                flag = false;
              }
            }
          } else {
            flag = false;
          }

          if (flag == false) {
            group.push({
              category: ele.category,
              total: ele.amount,
              items: [
                {
                  id: ele.id,
                  title: ele.title,
                  nameDate: `${ele.date} ${ele.fullDate.toLocaleString(
                    "default",
                    { month: "long" }
                  )}`,
                  type: ele.type,
                  title: ele.title,
                  amount: ele.amount,
                  date: ele.date,
                  month: ele.month,
                  year: ele.year,
                  fullDate: ele.fullDate,
                },
              ],
            });
          }
          return ele;
        });
        res.status(200).json(group);
      })
      .catch((err) => {
        // res.status(500).json({ message: err });
      });
  }

  static getAllGroupedByDate(req, res) {
    let userId = +req.params.UserId;
    let monthNum = +req.params.month;

    Transaction.findAll({
      where: {
        month: monthNum,
        UserId: userId,
      },
      order: [["date", "DESC"]],
    })
      .then((data) => {
        let group = [];
        let flag = true;
        data.forEach((ele) => {
          ele.type === "Expense" ? (ele.amount *= -1) : null;
          if (group.length > 0) {
            for (let i = 0; i < group.length; i++) {
              if (group[i].date == ele.date) {
                flag = true;
                group[i].total += ele.amount;
                group[i].items.push({
                  id: ele.id,
                  title: ele.title,
                  category: ele.category,
                  type: ele.type,
                  title: ele.title,
                  amount: ele.amount,
                  month: ele.month,
                  year: ele.year,
                  fullDate: ele.fullDate,
                });
              } else {
                flag = false;
              }
            }
          } else {
            flag = false;
          }

          if (flag == false) {
            group.push({
              date: ele.date,
              nameDate: `${ele.date} ${ele.fullDate.toLocaleString("default", {
                month: "long",
              })}`,
              total: ele.amount,
              items: [
                {
                  id: ele.id,
                  title: ele.title,
                  category: ele.category,
                  type: ele.type,
                  title: ele.title,
                  amount: ele.amount,
                  month: ele.month,
                  year: ele.year,
                  fullDate: ele.fullDate,
                },
              ],
            });
          }
          return ele;
        });

        res.status(200).json(group);
      })
      .catch((err) => {
        // res.status(500).json({ message: err });
      });
  }

  static getBetweenTwoDates(req, res) {
    let startDate = req.params.startDate;
    let endDate = req.params.endDate;
    let userId = +req.params.UserId;

    let allTransactions;

    Transaction.findAll({
      where: {
        UserId: userId,
        fullDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    })
      .then((data) => {
        allTransactions = [...data];
        allTransactions.forEach((ele) => {
          ele.type === "Expense" ? (ele.amount *= -1) : null;
          return ele;
        });

        let output = 0;
        for (let i = 0; i < allTransactions.length; i++) {
          output += allTransactions[i].amount;
        }

        res.status(200).json({ total: output, data: allTransactions });
      })
      .catch((err) => {
        // res.status(500).json({ message: err });
      });
  }

  static getBetweenTwoDatesByType(req, res) {
    let startDate = req.params.startDate;
    let endDate = req.params.endDate;
    let userId = +req.params.UserId;
    let type = req.params.type;

    let allTransactions;

    Transaction.findAll({
      where: {
        UserId: userId,
        type: type,
        fullDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: ["fullDate"],
    })
      .then((data) => {
        allTransactions = [...data];
        allTransactions.forEach((ele) => {
          ele.type === "Expense" ? (ele.amount *= -1) : null;
          return ele;
        });

        let output = 0;
        for (let i = 0; i < allTransactions.length; i++) {
          output += allTransactions[i].amount;
        }

        res.status(200).json({ total: output, data: allTransactions });
      })
      .catch((err) => {
        // res.status(500).json({ message: err });
      });
  }

  static async postOne(req, res) {
    const UserId = +req.params.UserId;
    // console.log('USERID', UserId)
    const { type, fullDate, category, note, amount, title } = req.body;
    // console.log('date', fullDate)
    // console.log('urlImage', req.urlImage)
    const fullDateArr = fullDate.split("-");
    const year = fullDateArr[0];
    const month = fullDateArr[1];
    const date = fullDateArr[2].slice(0, 2);
    try {
      const newData = await Transaction.create({
        UserId,
        type,
        amount: +amount,
        fullDate: new Date(fullDate),
        date,
        month,
        year,
        receiptImage: req.urlImage,
        category,
        note,
        title,
      });

      const userInstance = await User.findOne({ where: { id: UserId } });
      if (type === "Income") {
        userInstance.balance += Number(amount);
      } else if (type === "Expense") {
        userInstance.balance -= Number(amount);
      }
      await userInstance.save();

      res.status(200).json({ status: "success" });

      await History.create({
        event: `A transaction with id ${newData.id} has been created and user ${UserId} balance has been updated`,
      });
      res.status(201).json(newData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
  static async putOne(req, res) {
    // console.log(req.params, 'PARAMSS')
    const TransactionId = req.params.TransactionId;
    console.log(TransactionId);
    // console.log(TransactionId, 'TRANSID')
    const { type, fullDate, receiptImage, category, note, amount, title } =
      req.body;

    const fullDateArr = fullDate.split("-");
    const year = fullDateArr[0];
    const month = fullDateArr[1];
    const date = fullDateArr[2].slice(0, 2);

    try {
      const oldTransaction = await Transaction.findOne({
        where: { id: TransactionId },
      });

      console.log(oldTransaction);
      if (!oldTransaction)
        return res.status(400).json({ message: "Transaction not found" });

      const UserId = oldTransaction.UserId;
      const userInstance = await User.findOne({ where: { id: UserId } });

      if (amount) {
        // ? update balance
        if (type === "Income") {
          userInstance.balance =
            userInstance.balance - oldTransaction.amount + Number(amount);
        } else {
          userInstance.balance =
            userInstance.balance + oldTransaction.amount - Number(amount);
        }
      }
      await userInstance.save();
      console.log(userInstance);

      await Transaction.update(
        {
          type,
          fullDate,
          date,
          title,
          amount: +amount,
          month,
          year,
          receiptImage: req.urlImage,
          category,
          note,
          amount: +amount,
        },
        {
          where: {
            id: TransactionId,
          },
        }
      );
      res.status(200).json({ status: "success" });
    } catch (error) {
      console.log(error);
      // res.status(500).json({ message: error });
    }
  }

  static async deleteOne(req, res) {
    const TransactionId = +req.params.TransactionId;
    try {
      const transactionInstance = await Transaction.findOne({
        where: { id: TransactionId },
      });
      if (!transactionInstance)
        return res.status(400).json({ message: "Transaction not found" });
      const UserId = transactionInstance.UserId;

      // ? update balance
      const userInstance = await User.findOne({ where: { id: UserId } });
      if (transactionInstance.type === "Income") {
        userInstance.balance -= Number(transactionInstance.amount);
      } else if (transactionInstance.type === "Expense") {
        userInstance.balance += Number(transactionInstance.amount);
      }
      await userInstance.save();

      // ? deleting transaction
      transactionInstance.destroy();

      await History.create({
        event: `A transaction with id ${TransactionId} has been deleted`,
      });
      res.status(200).json({ status: "success" });
    } catch (error) {
      // res.status(500).json({ message: error });
    }
  }

  static async getByTransactionId(req, res) {
    const { TransactionId } = req.params;
    try {
      const transactionInstance = await Transaction.findOne({
        where: { id: TransactionId },
      });
      if (!transactionInstance)
        return res.status(400).json({ message: "Transaction not found" });
      res.status(200).json(transactionInstance);
    } catch (error) {
      // res.status(500).json({ message: error });
    }
  }
}

module.exports = TransactionController;
