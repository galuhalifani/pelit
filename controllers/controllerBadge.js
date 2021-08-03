const { Badge, User } = require("../models");

class Controller {
  static getAllBadges(req, res) {
    Badge.findAll({
      include: [User],
      order: ["id"],
    })
      .then((badges) => {
        res.status(200).json(badges);
      })
      .catch((err) => {
        // res.status(500).json({ message: err });
      });
  }

  static getBadgeById(req, res) {
    let badgeId = req.params.badgeId;

    Badge.findAll({
      where: {
        id: badgeId,
      },
      include: [User],
    })
      .then((badge) => {
        res.status(200).json(badge[0]);
      })
      .catch((err) => {
        // res.status(500).json({message: err })
      });
  }
}

module.exports = Controller;
