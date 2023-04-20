import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import userDetails from "../__mock__/userData";
import walletDetails from "../__mock__/walletData";

const { completeWalletDetail, incorrectWalletDetail1, incorrectWalletDetail2 } =
  walletDetails;
const { seededUser, malformedToken, expiredToken } = userDetails;

let userToken: string;
let req: ChaiHttp.Agent;

const loginRoute = "/api/v1/auth/login";
const baseWalletRoute = "/api/v1/wallet";

const { expect } = chai;
chai.use(chaiHttp);

describe("Wallet Controller", () => {
  before(async () => {
    req = chai.request.agent(app).keepOpen();
  });

  before(async () => {
    let loggedIn = await req.post(`${loginRoute}`).send(seededUser);
    userToken = loggedIn.body.data.accessToken;
  });

  after(async () => {
    req.close();
  });

  describe("Testing functionality for wallet endpoint", () => {
    it("should not create a wallet with empty currency", async () => {
      const res = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${userToken}`)
        .send(incorrectWalletDetail1);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        "Your missed a required fields: currency"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("should not create a wallet with invalid currency format", async () => {
      const res = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${userToken}`)
        .send(incorrectWalletDetail2);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        "The base currency should be either NGN or USD"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow malformed auth token user to create a wallet", async () => {
      const res = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${malformedToken}`)
        .send(completeWalletDetail);

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Invalid token");
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow expired auth token user to create a wallet", async () => {
      const res = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${expiredToken}`)
        .send(completeWalletDetail);

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("jwt expired");
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow unauthorized creation of a wallet", async () => {
      const res = await req
        .post(`${baseWalletRoute}/create`)
        .send(completeWalletDetail);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Unauthorized action. Access denied");
    });

    it("should allow authenticated user to create a wallet", async () => {
      const res = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${userToken}`)
        .send(completeWalletDetail);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Wallet created successfully");
      expect(res.body.data).to.be.an("object");
      expect(res.body.data).to.have.property("id");
      expect(res.body.data).to.have.property("user_id");
      expect(res.body.data).to.have.property("balance");
      expect(res.body.data.balance).to.equal("0.00");
      expect(res.body.data).to.have.property("currency");
      expect(res.body.data).to.have.property("account_name");
      expect(res.body.data).to.have.property("account_number");
    });
  });
});
