const request = require("supertest");
const app = require("../app.js");
const { User, Badge, Transaction } = require("../models");
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

let user_id;
let transaction_id;
let transactions = [];

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

      for (let i = 0; i < 3; i++) {
        let trans = {};
        trans.UserId = user_id;
        trans.type = "Expense";
        trans.amount = 300000;
        trans.fullDate = "2021-07-23";
        trans.month = 7;
        trans.date = 23;
        trans.receiptImage = "";
        trans.category = `Transportation`;
        trans.notes = "asdasdasd";
        trans.title = `makanExpense${i}`;

        transactions.push(trans);
      }

      for (let i = 0; i < 3; i++) {
        let trans = {};
        trans.UserId = user_id;
        trans.type = "Income";
        trans.amount = 200000;
        trans.fullDate = "2021-07-23";
        trans.month = 7;
        trans.date = 23;
        trans.receiptImage = "";
        trans.category = "Income";
        trans.notes = "asdasdasd";
        trans.title = `makan${i}`;

        transactions.push(trans);
      }

      // console.log(transactions)
      return Transaction.bulkCreate(transactions);
    })
    .then((data) => {
      transaction_id = data[0].id;
      done();
    })
    .catch((err) => {
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

describe("Get Transaction - SUCCESS", () => {
  test("GET by category", (done) => {
    request(app)
      .get(`/transactions/category/${user_id}/7`)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          for (let i = 0; i < res.body.length; i++) {
            expect(res.status).toBe(200);
            expect(res.body[i]).toHaveProperty("category", expect.any(String));
            expect(res.body[i]).toHaveProperty("total", expect.any(Number));
          }
          done();
        }
      });
  });
  test("GET by date", (done) => {
    request(app)
      .get(`/transactions/date/${user_id}/7`)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          for (let i = 0; i < res.body.length; i++) {
            expect(res.status).toBe(200);
            expect(res.body[i]).toHaveProperty("date", expect.any(Number));
            expect(res.body[i]).toHaveProperty("total", expect.any(Number));
          }
          done();
        }
      });
  });
  // test('GET all', (done) => {
  //     request(app)
  //     .get(`/transactions?category=Transportation&type=Expense&date=23&month=7&year=2021`)
  //     .end((err, res) => {
  //         if (err) {
  //             done(err)
  //         } else {
  //                 expect(res.status).toBe(200)
  //                 expect(res.body).toHaveProperty('id', expect.any(Number))
  //                 expect(res.body).toHaveProperty('amount', expect.any(Number))
  //                 expect(res.body).toHaveProperty('category', expect.any(String))
  //                 expect(res.body).toHaveProperty('type', expect.any(String))
  //             done()
  //         }
  //     })
  // })
  test("GET by id", (done) => {
    request(app)
      .get(`/transactions/expense/${transaction_id}`)
      .send({ month: 7 })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("id", expect.any(Number));
          expect(res.body).toHaveProperty("amount", expect.any(Number));
          expect(res.body).toHaveProperty("category", expect.any(String));
          expect(res.body).toHaveProperty("type", expect.any(String));
          done();
        }
      });
  });
  test("GET by userId", (done) => {
    request(app)
      .get(`/transactions/${user_id}`)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).toHaveProperty("UserId", expect.any(Number));
            expect(res.body[i]).toHaveProperty("amount", expect.any(Number));
            expect(res.body[i]).toHaveProperty("category", expect.any(String));
            expect(res.body[i]).toHaveProperty("type", expect.any(String));
          }
          done();
        }
      });
  });
  test("GET by type", (done) => {
    request(app)
      .get(`/transactions/${user_id}/Expense`)
      .send({ month: 7 })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("total", expect.any(Number));
          done();
        }
      });
  });
  test("GET between two dates", (done) => {
    request(app)
      .get(`/transactions/between/2021-07-20/2021-08-20/${user_id}`)
      // .send({startDate: '2021-07-20', endDate: '2021-08-20'})
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("total", expect.any(Number));
          done();
        }
      });
  });
  test("GET between two dates by type", (done) => {
    request(app)
      .get(`/transactions/between/2021-07-20/2021-08-20/${user_id}/Expense`)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("total", expect.any(Number));
          done();
        }
      });
  });
  test("Edit one", (done) => {
    let TransactionId = transaction_id;

    request(app)
      .put(`/transactions/${TransactionId}`)
      .field("UserId", user_id)
      .field("type", "Expense")
      .field("amount", -300000)
      .field("fullDate", "2021-07-23")
      .field("title", "makan")
      .field("category", "Food & Beverage")
      .field("notes", "asdasdasd")
      .attach("receiptImage", "./image/contoh-resi-jnt-express.jpg")
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("status", expect.any(String));
          done();
        }
      });
  });
  test("Delete one", (done) => {
    let TransactionId = transaction_id;
    request(app)
      .delete(`/transactions/${TransactionId}`)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("status", expect.any(String));
          done();
        }
      });
  });
});

describe("Add Transaction - SUCCESS", () => {
  test("POST transaction", (done) => {
    // let newTransaction = {};
    // let created = new Date();
    // newTransaction.UserId = UserId;
    // newTransaction.type = "Expense";
    // newTransaction.amount = -300000;
    // newTransaction.fullDate = "2021-07-23";
    // newTransaction.receiptImage = "";
    // newTransaction.category = "Food & Beverage";
    // newTransaction.notes = "asdasdasd";
    // newTransaction.title = "makan";

    request(app)
      .post(`/transactions/${user_id}`)
      // .send(newTransaction)
      .field("type", "Expense")
      .field("amount", -300000)
      .field("fullDate", "2021-07-23")
      .field("title", "makan")
      .field("category", "Food & Beverage")
      .field("notes", "asdasdasd")
      .attach("receiptImage", "./image/contoh-resi-jnt-express.jpg")
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // console.log(res.body, 'BODY')
          expect(res.status).toBe(201);
          expect(res.body.UserId).toBe(user_id);
          expect(res.body).toHaveProperty("type", expect.any(String));
          expect(res.body).toHaveProperty("category", expect.any(String));
          expect(res.body).toHaveProperty("amount", expect.any(Number));
          expect(res.body).toHaveProperty("month", expect.any(Number));
          expect(res.body).toHaveProperty("year", expect.any(Number));
          done();
        }
      });
  });
});
