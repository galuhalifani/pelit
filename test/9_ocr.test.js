const request = require("supertest");
const app = require("../app");

jest.setTimeout(200000);

jest.mock("node-cron");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /ocr [SUCCESS CASE]", () => {
  test("Shoud send a object with key: total, fullDate", (done) => {
    request(app)
      .post(`/ocr`)
      .attach("receiptImage", "./image/indomaret.jpg")
      .end((err, res) => {
        if (err) done(err);
        else {
          // console.log(res.body, "ini res body ocr");
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("total", expect.any(Number));
          expect(res.body).toHaveProperty("fullDate", expect.any(String));
          done();
        }
      });
  });
  test("Shoud send a object with key: total, fullDate", (done) => {
    request(app)
      .post(`/ocr`)
      .attach("receiptImage", "./image/date dd-mmm-yy.jpg")
      .end((err, res) => {
        if (err) done(err);
        else {
          // console.log(res.body, "ini res body ocr");
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("total", expect.any(Number));
          expect(res.body).toHaveProperty("fullDate", expect.any(String));
          done();
        }
      });
  });
});
