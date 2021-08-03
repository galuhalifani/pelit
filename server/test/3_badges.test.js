const request = require("supertest");
const app = require("../app.js");
const { User, Badge } = require("../models");
let {
  randomDate,
  sqlDateFormat,
  thirtyDaysFromNow,
  randomIntFromInterval,
} = require("../helpers/dateParser.js");
let formatter = require("../helpers/dateParser.js");

jest.mock("node-cron");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Get Badges - SUCCESS", () => {
  test("Success get all badge", (done) => {
    request(app)
      .get(`/badge`)
      // .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // console.log(res.body[0], 'RESULT')
          expect(res.status).toBe(200);
          expect(res.body.length).toEqual(5);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).toHaveProperty("name", expect.any(String));
            expect(res.body[i]).toHaveProperty(
              "description",
              expect.any(String)
            );
            expect(res.body[i]).toHaveProperty("imgUrl", expect.any(String));
          }
          done();
        }
      });
  });

  test("Success get badge by ID", (done) => {
    let id = 2;
    request(app)
      .get(`/badge/${id}`)
      // .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // console.log(res.body, 'RESULT')
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("name", expect.any(String));
          expect(res.body).toHaveProperty("description", expect.any(String));
          expect(res.body).toHaveProperty("imgUrl", expect.any(String));
          done();
        }
      });
  });
});
