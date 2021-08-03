const request = require("supertest");
const app = require("../app.js");
const { User, Target } = require("../models");
let {
  randomDate,
  sqlDateFormat,
  thirtyDaysFromNow,
  randomIntFromInterval,
} = require("../helpers/dateParser.js");

let user = {
  email: "test@email.com",
  password: "password123",
};

let targets = [];
let user_id;

jest.mock("node-cron");

beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll((done) => {
  User.create({
    ...user,
    fullName: "Test User",
    photoProfile: "",
    balance: 2000000,
  }) // create user
    .then((user) => {
      let userId = user.id;
      user_id = user.id;

      for (let i = 0; i < 5; i++) {
        let target = {};
        target.UserId = userId;
        target.startDate = sqlDateFormat(
          randomDate(new Date(2012, 0, 1), new Date())
        );
        target.endDate = sqlDateFormat(thirtyDaysFromNow(target.startDate, 30));
        target.monthlyTarget = randomIntFromInterval(5000000, 20000000);
        target.isActive = false;

        targets.push(target);
      }

      return Target.bulkCreate(targets);
    })
    .then((allTargets) => {
      // console.log('SUCCESS CREATING TARGETS')
      done();
    })
    .catch((err) => {
      // console.log('ERRRRRORRR CREATE USER')
      done(err);
    });
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      // console.log('destroyed')
      return Target.destroy({ truncate: true, cascade: true });
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Add Target - SUCCESS", () => {
  test("Add target success", (done) => {
    let newTarget = {};
    newTarget.startDate = sqlDateFormat(
      randomDate(new Date(2012, 0, 1), new Date())
    );
    newTarget.endDate = thirtyDaysFromNow(newTarget.startDate, 30);
    newTarget.monthlyTarget = randomIntFromInterval(5000000, 20000000);

    request(app)
      .post(`/target/all/${user_id}`)
      .send(newTarget)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body.UserId).toBe(user_id);
          expect(res.body).toHaveProperty("startDate", expect.any(String));
          expect(res.body).toHaveProperty("endDate", expect.any(String));
          expect(res.body).toHaveProperty("monthlyTarget", expect.any(Number));
          expect(res.body.isActive).toBe(true);
          done();
        }
      });
  });

  describe("Patch Target Status - SUCCESS", () => {
    test("Active target change to ended", (done) => {
      request(app)
        .patch(`/target/status/${user_id}`)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toBe("Target successfully ended");
            done();
          }
        });
    });
  });
});
