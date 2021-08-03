const { Target, User } = require("../models");

class Controller {
  static getTargetByUser(req, res) {
    let userId = req.params.userId;

    Target.findAll({
      where: {
        UserId: userId,
      },
      include: [User],
      order: [["startDate", "DESC"]],
    })
      .then((targets) => {
        res.status(200).json(targets);
      })
      .catch((err) => {
        // res.status(500).json({message: err })
      });
  }

  static getActiveTargetByUser(req, res) {
    let userId = req.params.userId;

    Target.findAll({
      where: {
        UserId: userId,
        isActive: true,
      },
      include: [User],
      order: [["startDate", "DESC"]],
    })
      .then((targets) => {
        res.status(200).json(targets);
      })
      .catch((err) => {
        // res.status(500).json({message: err })
      });
  }

  static addTargetByUser(req, res) {
    let userId = req.params.userId;

    let newTarget = {};
    newTarget.UserId = userId;
    newTarget.startDate = req.body.startDate;
    newTarget.endDate = req.body.endDate;
    newTarget.monthlyTarget = req.body.monthlyTarget;
    newTarget.isActive = true;

    Target.findAll({
      where: {
        UserId: userId,
        isActive: true,
      },
      include: [User],
      order: [["startDate", "DESC"]],
    }).then((targets) => {
      if (targets.length > 0) {
        return res.status(400).json({
          message: `Can't add new target: there is already an active target`,
        });
      } else {
        Target.create(newTarget).then((target) => {
          res.status(200).json(target);
        });
        // .catch(err => {
        //     res.status(500).json({message: err })
        // })
      }
    });
  }

  static editActiveTargetByUser(req, res) {
    // let userId = req.params.userId;
    // let editedTarget = {};
    // editedTarget.UserId = userId;
    // editedTarget.startDate = req.body.startDate;
    // editedTarget.endDate = req.body.endDate;
    // editedTarget.monthlyTarget = req.body.monthlyTarget;
    // editedTarget.isActive = true;
    // Target.update({
    //   where: {
    //     UserId: userId,
    //     isActive: true,
    //   },
    // }).then(() => {
    //   res.status(200).json(`Target successfully updated`);
    // });
  }

  static editActiveTargetStatusByUser(req, res) {
    let userId = req.params.userId;

    Target.update(
      { isActive: false },
      {
        where: {
          UserId: userId,
          isActive: true,
        },
      }
    )
      .then(() => {
        res.status(200).json(`Target successfully ended`);
      })
      .catch((err) => {
        // res.status(500).json({message: err })
      });
  }

  // static deleteTargetById(req, res) {
  //     let targetId = req.params.targetId

  //     Target.destroy({
  //         where: {
  //             id: targetId,
  //           }
  //     })
  //     .then(() => {
  //         res.status(200).json(`Target id ${targetId} successfully deleted`)
  //     })
  //     .catch(err => {
  //         res.status(500).json({message: err })
  //     })
  // }
}

module.exports = Controller;
