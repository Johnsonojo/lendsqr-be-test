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
    userOneToken = loggedInUserOne.body.data.accessToken;

    let loggedInUserTwo = await req
      .post(`${loginRoute}`)
      .send(seededUserWithWallet2);
    userTwoToken = loggedInUserTwo.body.data.accessToken;

    let loggedInUserThree = await req
      .post(`${loginRoute}`)
      .send(seededUserWithoutWallet);
    userThreeToken = loggedInUserThree.body.data.accessToken;
  });

  after(async () => {
    req.close();
  });

  describe("Single Wallet ", () => {
    describe("Wallet Creation and Funding", () => {
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
        const res2 = await req
          .post(`${baseWalletRoute}/fund/${res.body.data.account_number}`)
          .set("authorization", `Bearer ${userThreeToken}`)
          .send(completeFundingDetail);

        expect(res2.status).to.equal(200);
        expect(res2.body).to.be.an("object");
        expect(res2.body.message).to.equal("Wallet funded successfully");
        expect(res2.body.data).to.be.an("object");
        expect(res2.body.data).to.have.property("id");
        expect(res2.body.data).to.have.property("user_id");
        expect(res2.body.data).to.have.property("balance");
        expect(res2.body.data.balance).to.equal("1000.00");
        expect(res2.body.data).to.have.property("currency");
        expect(res2.body.data).to.have.property("account_name");
        expect(res2.body.data).to.have.property("account_number");
      });

      it("should not fund a wallet with empty amount", async () => {
        const res1 = await req
          .post(`${baseWalletRoute}/fund/${res.body.data.account_number}}`)
          .set("authorization", `Bearer ${userThreeToken}`)
          .send(incorrectFundingDetail1);

        expect(res1.status).to.equal(400);
        expect(res1.body).to.be.an("object");
        expect(res1.body.message).to.equal(
          "Your missed a required fields: amount"
        );
        expect(res1.body.status).to.equal("failure");
      });

      it("should not fund a wallet with invalid amount format", async () => {
        const res2 = await req
          .post(`${baseWalletRoute}/fund/${res.body.data.account_number}}`)
          .set("authorization", `Bearer ${userThreeToken}`)
          .send(incorrectFundingDetail2);

        expect(res2.status).to.equal(400);
        expect(res2.body).to.be.an("object");
        expect(res2.body.message).to.equal("Invalid amount format");
        expect(res2.body.status).to.equal("failure");
      });

      it("should not allow authenticated user to create more than one wallet", async () => {
        const res2 = await req
          .post(`${baseWalletRoute}/create`)
          .set("authorization", `Bearer ${userThreeToken}`)
          .send(completeWalletDetail);

        expect(res2.status).to.equal(409);
        expect(res2.body).to.be.an("object");
        expect(res2.body.message).to.equal("User already has a wallet");
        expect(res2.body.status).to.equal("failure");
      });
    });

    describe("Wallet Creation and Funding Issues", () => {
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
  });

  describe("Multiple Wallet", () => {
    describe("Wallet Creation and Funding", () => {
      let res: ChaiHttp.Response;

      it("should allow authenticated user to create more than one wallet", async () => {
        res = await req
          .post(`${baseWalletRoute}/create-multiple`)
          .set("authorization", `Bearer ${userOneToken}`)
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
        const res2 = await req
          .post(`${baseWalletRoute}/fund/${res.body.data.account_number}`)
          .set("authorization", `Bearer ${userOneToken}`)
          .send(completeFundingDetail);

        expect(res2.status).to.equal(200);
        expect(res2.body).to.be.an("object");
        expect(res2.body.message).to.equal("Wallet funded successfully");
        expect(res2.body.data).to.be.an("object");
        expect(res2.body.data).to.have.property("id");
        expect(res2.body.data).to.have.property("user_id");
        expect(res2.body.data).to.have.property("balance");
        expect(res2.body.data.balance).to.equal("1000.00");
        expect(res2.body.data).to.have.property("currency");
        expect(res2.body.data).to.have.property("account_name");
        expect(res2.body.data).to.have.property("account_number");
      });
    });
  });

  describe("Inter Wallet Transfer", () => {
    describe("Wallet Transfer", () => {
      it("should allow funds to be transferred to another user", async () => {
        const res = await req
          .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
          .set("authorization", `Bearer ${userOneToken}`)
          .send(completeTransferDetail1);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("Wallet funded successfully");
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

      it("should not allow transfer with empty receiverAccountNumber  field", async () => {
        const res = await req
          .post(`${baseWalletRoute}/transfer/${seededWallet1.account_number}`)
          .set("authorization", `Bearer ${userOneToken}`)
          .send(incompleteTransferDetail3);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal(
          "Your missed a required fields: receiverAccountNumber"
        );
        expect(res.body.status).to.equal("failure");
      });

      it("should not allow transfer with empty receiverAccountNumber  field", async () => {
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
        expect(res.body.message).to.equal(
          "You cannot transfer fund to yourself"
        );
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
  });
});
