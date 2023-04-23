import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
import userDetails from "../__mock__/userData";
import walletDetails from "../__mock__/walletData";

const {
  completeWalletDetail,
  incorrectWalletDetail1,
  incorrectWalletDetail2,
  completeFundingDetail,
  incorrectFundingDetail1,
  incorrectFundingDetail2,
  wrongAccountNumber,
  completeTransferDetail1,
  completeTransferDetail2,
  inSufficientFundDetail,
  seededWallet1,
  incorrectFundingNumber,
  incompleteTransferDetail1,
  incompleteTransferDetail2,
  incompleteTransferDetail3,
  incompleteTransferDetail4,
  withdrawalOfFundDetail,
  emptyWithdrawalDetail,
  insufficientWithdrawalDetail,
} = walletDetails;

const {
  seededUserWithWallet1,
  seededUserWithWallet2,
  malformedToken,
  expiredToken,
  seededUserWithoutWallet,
} = userDetails;

let userOneToken: string;
let userTwoToken: string;
let userThreeToken: string;
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
    let loggedInUserOne = await req
      .post(`${loginRoute}`)
      .send(seededUserWithWallet1);
    userOneToken = loggedInUserOne.body.data.access_token;

    let loggedInUserTwo = await req
      .post(`${loginRoute}`)
      .send(seededUserWithWallet2);
    userTwoToken = loggedInUserTwo.body.data.access_token;

    let loggedInUserThree = await req
      .post(`${loginRoute}`)
      .send(seededUserWithoutWallet);
    userThreeToken = loggedInUserThree.body.data.access_token;
  });

  after(async () => {
    req.close();
  });

  describe("Wallet Creation, Funding and Fetching", () => {
    let res: ChaiHttp.Response;

    it("should allow authenticated user to create a wallet", async () => {
      res = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${userThreeToken}`)
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

    it("should allow user to fund a wallet", async () => {
      const res1 = await req
        .post(`${baseWalletRoute}/fund/${res.body.data.account_number}`)
        .set("authorization", `Bearer ${userThreeToken}`)
        .send(completeFundingDetail);

      expect(res1.status).to.equal(200);
      expect(res1.body).to.be.an("object");
      expect(res1.body.message).to.equal("Wallet funded successfully");
      expect(res1.body.data).to.be.an("object");
      expect(res1.body.data).to.have.property("id");
      expect(res1.body.data).to.have.property("user_id");
      expect(res1.body.data).to.have.property("balance");
      expect(res1.body.data.balance).to.equal("1000.00");
      expect(res1.body.data).to.have.property("currency");
      expect(res1.body.data).to.have.property("account_name");
      expect(res1.body.data).to.have.property("account_number");
    });

    it("should not fund a wallet with empty amount", async () => {
      const res2 = await req
        .post(`${baseWalletRoute}/fund/${res.body.data.account_number}}`)
        .set("authorization", `Bearer ${userThreeToken}`)
        .send(incorrectFundingDetail1);

      expect(res2.status).to.equal(400);
      expect(res2.body).to.be.an("object");
      expect(res2.body.message).to.equal(
        "Your missed a required fields: amount"
      );
      expect(res2.body.status).to.equal("failure");
    });

    it("should not fund a wallet with invalid amount format", async () => {
      const res3 = await req
        .post(`${baseWalletRoute}/fund/${res.body.data.account_number}}`)
        .set("authorization", `Bearer ${userThreeToken}`)
        .send(incorrectFundingDetail2);

      expect(res3.status).to.equal(400);
      expect(res3.body).to.be.an("object");
      expect(res3.body.message).to.equal("Invalid amount format");
      expect(res3.body.status).to.equal("failure");
    });

    it("should not allow authenticated user to create more than one wallet", async () => {
      const res3 = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${userThreeToken}`)
        .send(completeWalletDetail);

      expect(res3.status).to.equal(409);
      expect(res3.body).to.be.an("object");
      expect(res3.body.message).to.equal("User already has a wallet");
      expect(res3.body.status).to.equal("failure");
    });

    it("should allow user to fetch their wallet", async () => {
      const res4 = await req
        .get(`${baseWalletRoute}/${res.body.data.account_number}`)
        .set("authorization", `Bearer ${userThreeToken}`);

      expect(res4.status).to.equal(200);
      expect(res4.body).to.be.an("object");
      expect(res4.body.message).to.equal("Wallet retrieved successfully");
      expect(res4.body.data).to.be.an("object");
      expect(res4.body.data).to.have.property("id");
      expect(res4.body.data).to.have.property("currency");
      expect(res4.body.data).to.have.property("balance");
      expect(res4.body.data.balance).to.equal("1000.00");
      expect(res4.body.data).to.have.property("account_name");
      expect(res4.body.data).to.have.property("account_number");
      expect(res4.body.data).to.have.property("user_id");
      expect(res4.body.data).to.have.property("created_at");
    });

    it("should not create a wallet with empty currency", async () => {
      const res = await req
        .post(`${baseWalletRoute}/create`)
        .set("authorization", `Bearer ${userTwoToken}`)
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
        .set("authorization", `Bearer ${userTwoToken}`)
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

    it("should not fund a wallet with wrong account number", async () => {
      const res3 = await req
        .post(`${baseWalletRoute}/fund/${wrongAccountNumber}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(completeFundingDetail);

      expect(res3.status).to.equal(404);
      expect(res3.body).to.be.an("object");
      expect(res3.body.message).to.equal("Wallet not found");
      expect(res3.body.status).to.equal("failure");
    });
  });

  describe("Inter Wallet Transfer", () => {
    it("should allow funds to be transferred to another user", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(completeTransferDetail1);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Fund transferred successfully");
      expect(res.body.status).to.equal("success");
    });

    it("should not allow transfer with empty amount field", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(incompleteTransferDetail1);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        "Your missed a required fields: amount"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow transfer with malformed amount field", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(incompleteTransferDetail2);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Invalid amount format");
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow transfer with empty receiver_account_number field", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(incompleteTransferDetail3);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        "Your missed a required fields: receiver_account_number"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow transfer with invalid receiver account field", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(incompleteTransferDetail4);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Invalid receiver account number");
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow transfer to a wallet that does not exist", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${wrongAccountNumber}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(completeTransferDetail1);

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Wallet not found");
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow transfer with same sender and receiver account", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(completeTransferDetail2);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("You cannot transfer fund to yourself");
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow transfer with insufficient balance", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(inSufficientFundDetail);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Insufficient funds");
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow transfer to account that doesn't exist", async () => {
      const res = await req
        .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(incorrectFundingNumber);

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Receiver wallet does not exist");
      expect(res.body.status).to.equal("failure");
    });
  });

  describe("Wallet Withdrawal", () => {
    it("should allow user to withdraw from their account", async () => {
      const res = await req
        .post(`${baseWalletRoute}/withdraw/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(withdrawalOfFundDetail);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Fund withdrawal successful");
      expect(res.body.status).to.equal("success");
    });

    it("should not allow withdrawal with empty amount field", async () => {
      const res = await req
        .post(`${baseWalletRoute}/withdraw/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(emptyWithdrawalDetail);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        "Your missed a required fields: amount"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("should not allow withdrawal with empty amount field", async () => {
      const res = await req
        .post(`${baseWalletRoute}/withdraw/${seededWallet1.account_number}`)
        .set("authorization", `Bearer ${userOneToken}`)
        .send(insufficientWithdrawalDetail);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Insufficient funds");
      expect(res.body.status).to.equal("failure");
    });
  });
});
