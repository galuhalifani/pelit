const request = require("supertest");
const app = require("../app.js");
const { User, Target } = require("../models");
let {
  randomDate,
  sqlDateFormat,
  thirtyDaysFromNow,
  randomIntFromInterval,
} = require("../helpers/dateParser.js");
let formatter = require("../helpers/dateParser.js");

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

      let activeTarget = {};
      activeTarget.UserId = userId;
      activeTarget.startDate = sqlDateFormat(
        randomDate(new Date(2012, 0, 1), new Date())
      );
      activeTarget.endDate = thirtyDaysFromNow(activeTarget.startDate, 30);
      activeTarget.monthlyTarget = randomIntFromInterval(5000000, 20000000);
      activeTarget.isActive = true;

      targets.push(activeTarget);

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

describe("Get Target - SUCCESS", () => {
  test("Fetchin targets, to have keys: UserId, startDate, endDate, monthlyTarget, isActive", (done) => {
    request(app)
      .get(`/target/all/${user_id}`)
      // .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // console.log(res.body[0])
          expect(res.status).toBe(200);
          expect(res.body.length).toEqual(targets.length);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).toHaveProperty("UserId", expect.any(Number));
            expect(res.body[i]).toHaveProperty("startDate", expect.any(String));
            expect(res.body[i]).toHaveProperty("endDate", expect.any(String));
            expect(res.body[i]).toHaveProperty(
              "monthlyTarget",
              expect.any(Number)
            );
            expect(res.body[i]).toHaveProperty("isActive", expect.any(Boolean));
          }
          done();
        }
      });
  });

  test("Fetchin active target, to have keys: UserId, startDate, endDate, monthlyTarget, isActive", (done) => {
    request(app)
      .get(`/target/active/${user_id}`)
      // .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body.length).toEqual(1);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).toHaveProperty("UserId", expect.any(Number));
            expect(res.body[i]).toHaveProperty("startDate", expect.any(String));
            expect(res.body[i]).toHaveProperty("endDate", expect.any(String));
            expect(res.body[i]).toHaveProperty(
              "monthlyTarget",
              expect.any(Number)
            );
            expect(res.body[i]).toHaveProperty("isActive", expect.any(Boolean));
            expect(res.body[i]).not.toHaveProperty("password");
          }
          done();
        }
      });
  });
});

describe("Add Target - FAILED", () => {
  test("Add target failed due to active target already exist", (done) => {
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
          expect(res.status).toBe(400);
          expect(res.body.message).toBe(
            "Can't add new target: there is already an active target"
          );
          done();
        }
      });
  });
});
