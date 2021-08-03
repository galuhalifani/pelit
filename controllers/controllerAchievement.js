const { Achievement, Badge, User, Target, Transaction } = require("../models");
var cron = require("node-cron");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

class Controller {
  static addAchievement(req, res) {
    let userId = req.params.userId;
    let badgeId = req.params.badgeId;
    let newAchievement = {};

    let created = new Date();

    newAchievement.UserId = userId;
    newAchievement.BadgeId = badgeId;
    newAchievement.date = created.getDate();
    newAchievement.month = created.getMonth() + 1;
    newAchievement.year = created.getFullYear();

    Achievement.create(newAchievement)
      .then((achievement) => {
        res.status(200).json(achievement);
      })
      .catch((err) => {
        // res.status(500).json({message: err })
      });
  }

  static autoAchievement(req, res) {
    let achievements = [];
    let users = [];

    User.findAll({
      include: [
        {
          model: Target,
          as: "Targets",
          where: { isActive: true },
        },
      ],
    }).then((user) => {
      for (let i = 0; i < user.length; i++) {
        if (user[i].Targets[0].endDate < new Date()) {
          users.push(user[i]);
        }
      }
      // res.status(200).json(users)
      for (let j = 0; j < users.length; j++) {
        // console.log(users[j].Targets, 'ID')
        let start = users[j].Targets[0].startDate;
        let end = users[j].Targets[0].endDate;
        // console.log(start, end)
        let achievement = {};

        Transaction.findAll({
          where: {
            UserId: users[j].id,
            type: "Expense",
            fullDate: {
              [Op.between]: [start, end],
            },
          },
          order: ["fullDate"],
        }).then((data) => {
          let allTransactions = [...data];
          let output = 0;
          let target = users[j].Targets[0].monthlyTarget;

          for (let k = 0; k < allTransactions.length; k++) {
            output += allTransactions[k].amount;
          }

          // console.log(output, 'OUTPUT')
          let percentage = output / target;
          achievement.userId = users[j].id;

          // console.log(percentage)
          if (percentage < 0.8) {
            achievement.badge = 2;
          } else if (percentage <= 1) {
            achievement.badge = 1;
          } else if (percentage < 1.2) {
            achievement.badge = 3;
          } else if (percentage < 1.5) {
            achievement.badge = 4;
          } else {
            achievement.badge = 5;
          }

          achievements.push(achievement);
          let newAchievements = [];
          if (j == users.length - 1) {
            for (let i = 0; i < achievements.length; i++) {
              let userId = achievements[i].userId;
              let badgeId = achievements[i].badge;
              let newAchievement = {};

              let created = new Date();

              newAchievement.UserId = userId;
              newAchievement.BadgeId = badgeId;
              newAchievement.date = created.getDate();
              newAchievement.month = created.getMonth() + 1;
              newAchievement.year = created.getFullYear();

              Achievement.create(newAchievement).then((achievement) => {
                newAchievements.push(achievement);
                User.findOne({ where: { id: userId } }).then((user) => {
                  if (user && user.pushToken) {
                    let message = {
                      to: user.pushToken,
                      sound: "default",
                      title: "Pelit App",
                      body: "You got a new badge! Check it out!",
                    };
                    expo.sendPushNotificationsAsync([message]);
                  }

                  Target.update(
                    { isActive: false },
                    {
                      where: {
                        UserId: userId,
                        isActive: true,
                      },
                    }
                  );
                });
                // if (i == achievements.length - 1) {
                //     console.log('Success!')
                //     console.log(newAchievements, 'SUCCESS')
                // }
              });
              // .catch(err => {
              //     console.log(err, 'error')
              // })
            }
          }
        });
      }
    });
  }
}

module.exports = Controller;
