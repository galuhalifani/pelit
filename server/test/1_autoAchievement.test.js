const request = require("supertest");
const app = require("../app.js");
const { Achievement, Badge, User, Target, Transaction } = require("../models");
var cron = require("node-cron");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const { Expo } = require("expo-server-sdk");
const expo = new Expo();
let {
  randomDate,
  sqlDateFormat,
  thirtyDaysFromNow,
  randomIntFromInterval,
} = require("../helpers/dateParser.js");
let formatter = require("../helpers/dateParser.js");
const { autoAchievement } = require("../controllers/controllerAchievement");
const Controller = require("../controllers/controllerAchievement");
// const {jest} = require ('@jest/globals')

const consoleSpy = jest.spyOn(console, "log").mockImplementation();
const log = console.log;
let user = {
  email: "test@email.com",
  password: "password123",
};

let user_id;
let pushToken;
let targets = [];

// jest.mock("node-cron");

beforeEach(() => {
  // jest.clearAllMocks();
  jest.setTimeout(30000);
});

beforeAll((done) => {
  User.create({
    ...user,
    fullName: "Test User",
    photoProfile: "",
    balance: 2000000,
    pushToken: "ExponentPushToken[lWVeNgF_A_VAyBqN2Tum6o]",
  }) // create user
    .then((user) => {
      user_id = user.id;
      pushToken = user.pushToken;

      let target = {};
      target.UserId = user_id;
      target.startDate = new Date("2021-01-01");
      target.endDate = new Date("2021-01-31");
      target.monthlyTarget = 100000;
      target.isActive = true;

      console.log(target);
      console.log(user);

      return Target.create(target);
    })
    .then(() => {
      let trans = {};
      trans.UserId = user_id;
      trans.type = "Expense";
      trans.amount = 1000000;
      trans.fullDate = "2021-01-15";
      trans.receiptImage = "";
      trans.category = "Transportation";
      trans.notes = "asdasdasd";
      trans.title = "makan";

      return Transaction.create(trans);
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log("ERRRRRORRR CREATE");
      done(err);
    });
});

afterAll((done) => {
  // sequelize.truncate()
  Target.destroy({ truncate: true, cascade: true })
    // .then(() => {
    //     return Target.destroy({ truncate: true, cascade: true})
    // })
    .then(() => {
      return Transaction.destroy({ truncate: true, cascade: true });
    })
    .then(() => {
      return User.destroy({ truncate: true, cascade: true });
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Auto Achievement - SUCCESS", () => {
  it.only("Success run new achievement", async () => {
    jest.setTimeout(300000);
    const spy = jest.spyOn(console, "log");

    await autoAchievement();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
