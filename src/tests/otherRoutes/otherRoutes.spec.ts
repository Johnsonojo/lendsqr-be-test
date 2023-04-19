import chai from "chai";
import chaiHttp from "chai-http";
import app from "../..";

let req: ChaiHttp.Agent;
const { expect } = chai;
chai.use(chaiHttp);

describe("Other Routes", () => {
  before(async () => {
    req = chai.request(app).keepOpen();
  });

  after(async () => {
    req.close();
  });

  describe("Other Routes Functionality", () => {
    it("it should get the home route", async () => {
      const res = await req.get("/");

      expect(res.status).to.equal(200);
      expect(res.body.message).to.be.eql("Welcome to Lendsqr API!");
    });

    it("it should throw an error for routes that does not exists", async () => {
      const res = await req.delete("/");

      expect(res.status).to.equal(404);
      expect(res.body.message).to.be.eql("Oooop! This page does not exist");
    });
  });
});
