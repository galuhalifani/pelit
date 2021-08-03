const request = require("supertest");
const app = require("../app");
const { User, Transaction } = require("../models");

let user = {
  email: "test@email.com",
  password: "password123",
};

let targets = [];
let user_id;
let transaction_id;

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
      user_id = user.id;

      let trans = {};
      trans.UserId = user_id;
      trans.type = "Expense";
      trans.amount = -300000;
      trans.fullDate = "2021-07-23";
      trans.receiptImage = "";
      trans.category = "Transportation";
      trans.notes = "asdasdasd";
      trans.title = "makan";

      return Transaction.create(trans);
    })
    .then((data) => {
      transaction_id = data.id;

      let trans = {};
      trans.UserId = user_id;
      trans.type = "Income";
      trans.amount = -300000;
      trans.fullDate = "2021-07-23";
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
      // console.log('ERRRRRORRR CREATE USER')
      done(err);
    });
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      return Transaction.destroy({ truncate: true, cascade: true });
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("GET /user/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: fullName, email, photoProfile, balance and id", (done) => {
    request(app)
      .get(`/user/${user_id}`)
      .end((err, res) => {
        if (err) done(err);
        else {
          // console.log(user_id, 'USER ID')
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("fullName", expect.any(String));
          expect(res.body).toHaveProperty("email", expect.any(String));
          expect(res.body).toHaveProperty("photoProfile", expect.any(String));
          expect(res.body).toHaveProperty("balance", expect.any(Number));
          expect(res.body).toHaveProperty("id", expect.any(Number));
          done();
        }
      });
  });
});

describe("GET /user/:userId [ERROR CASE]", () => {
  test("Shoud send a object with key: message", (done) => {
    request(app)
      .get(`/user/1000`)
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty("message", "user not found");
          done();
        }
      });
  });
});

describe("PATCH /user/balance/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: message and balance", (done) => {
    request(app)
      .patch(`/user/balance/${user_id}`)
      .send({
        balance: 50000,
      })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty(
            "message",
            "Balance has been updated successfully"
          );
          expect(res.body).toHaveProperty("balance", expect.any(Number));
          done();
        }
      });
  });
});

describe("PATCH /user/photo-profile/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: message and photoProfile", (done) => {
    request(app)
      .patch(`/user/photo-profile/${user_id}`)
      .send({
        photoProfile:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/2048px-User_icon_2.svg.png",
      })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty(
            "message",
            "Photo profile has been updated successfully"
          );
          expect(res.body).toHaveProperty("photoProfile", expect.any(String));
          done();
        }
      });
  });
});

describe("PATCH /user/email/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: message and email", (done) => {
    request(app)
      .patch(`/user/email/${user_id}`)
      .send({
        email: "baba@mail.com",
      })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty(
            "message",
            "Email has been updated successfully"
          );
          expect(res.body).toHaveProperty("email", expect.any(String));
          done();
        }
      });
  });
});

describe("PATCH /user/password/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: message and password", (done) => {
    request(app)
      .patch(`/user/password/${user_id}`)
      .send({
        password: "baba@mail.com",
      })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty(
            "message",
            "Password has been updated successfully"
          );
          done();
        }
      });
  });
});

describe("PATCH /user/full-name/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: message and full name", (done) => {
    request(app)
      .patch(`/user/full-name/${user_id}`)
      .send({
        fullName: "Baba Dadak",
      })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty(
            "message",
            "Full name has been updated successfully"
          );
          expect(res.body).toHaveProperty("fullName", expect.any(String));
          done();
        }
      });
  });
});

describe("PATCH /user/full-name/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: message and full name", (done) => {
    request(app)
      .patch(`/user/full-name/${user_id}`)
      .send({
        fullName: "Baba Dadak",
      })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty(
            "message",
            "Full name has been updated successfully"
          );
          expect(res.body).toHaveProperty("fullName", expect.any(String));
          done();
        }
      });
  });
});

describe("PATCH /user/pushtoken/:userId [SUCCESS CASE]", () => {
  test("Shoud send a object with key: message and full name", (done) => {
    request(app)
      .patch(`/user/pushtoken/${user_id}`)
      .send({
        fullName: "abcasdas3432s",
      })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message", "Updated pushToken");
          done();
        }
      });
  });
});
