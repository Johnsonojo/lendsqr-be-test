import chai from "chai";
import chaiHttp from "chai-http";
import app from "../..";
import userDetails from "../__mock__/userData";

const {
  completeRegistrationDetails,
  completeRegistrationDetailsDuplicate,
  incompleteRegistrationDetails1,
  incompleteRegistrationDetails2,
  incompleteRegistrationDetails3,
  incompleteRegistrationDetails4,
  incompleteRegistrationDetails5,
  incompleteRegistrationDetails6,
  incompleteRegistrationDetails7,
  incompleteRegistrationDetails8,
  incompleteRegistrationDetails9,
  incompleteRegistrationDetails10,
  completeLoginDetails,
  incompleteLoginDetails1,
  incompleteLoginDetails2,
  incompleteLoginDetails3,
  incorrectLoginDetails1,
  incorrectLoginDetails2,
  incorrectLoginDetails3,
} = userDetails;

let req: ChaiHttp.Agent;
const { expect } = chai;
chai.use(chaiHttp);

const baseRoute = "/api/v1/auth";
const signupRoute = `${baseRoute}/signup`;
const loginRoute = `${baseRoute}/login`;

describe("User Controller", () => {
  before(async () => {
    req = chai.request(app).keepOpen();
  });

  after(async () => {
    req.close();
  });

  describe("Registration functionality", () => {
    it("should register a user using the registration endpoint", async () => {
      const res = await req.post(signupRoute).send(completeRegistrationDetails);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an("object");
      expect(res.body.data).to.be.an("object");
      expect(res.body.data).to.have.property("id");
      expect(res.body.data.id).to.be.a("string");
      expect(res.body.data).to.have.property("email");
      expect(res.body.data.email).to.be.a("string");
      expect(res.body.data).to.have.property("first_name");
      expect(res.body.data.first_name).to.be.a("string");
      expect(res.body.data).to.have.property("last_name");
      expect(res.body.data.last_name).to.be.a("string");
      expect(res.body.data).to.have.property("created_at");
      expect(res.body.data.created_at).to.be.a("string");
    });

    it("Should fail to register a user without email", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails1);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Your missed a required fields: email");
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without password", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails2);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Your missed a required fields: password"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without first name", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails3);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Your missed a required fields: first_name"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without last name", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails4);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Your missed a required fields: last_name"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without phone number", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails5);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Your missed a required fields: phone_number"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user with already existing email", async () => {
      const res = await req
        .post(signupRoute)
        .send(completeRegistrationDetailsDuplicate);

      expect(res.status).to.equal(409);
      expect(res.body.message).to.equal("User already exists");
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without proper email", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails6);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Please provide a valid email address");
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without proper password", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails7);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Please provide a valid email address; Password must be at least eight characters consisting of at least one uppercase, one lowercase, and one number"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without proper first name", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails8);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "The first name you provided is too short"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without proper last name", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails9);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "The last name you provided is too short"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("Should fail to register a user without proper phone number", async () => {
      const res = await req
        .post(signupRoute)
        .send(incompleteRegistrationDetails10);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Please provide a valid phone number");
      expect(res.body.status).to.equal("failure");
    });
  });

  describe("Login functionality", () => {
    it("should log a user in using the login endpoint", async () => {
      const res = await req.post(loginRoute).send(completeLoginDetails);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Login successful");
      expect(res.body.data).to.be.an("object");
      expect(res.body.data).to.have.property("first_name");
      expect(res.body.data.first_name).to.be.a("string");
      expect(res.body.data).to.have.property("user_id");
      expect(res.body.data.user_id).to.be.a("string");
      expect(res.body.data).to.have.property("access_token");
      expect(res.body.data.access_token).to.be.a("string");
      expect(res.body.data).to.have.property("refresh_token");
      expect(res.body.data.refresh_token).to.be.a("string");
      expect(res.body.data).to.have.property("created_at");
      expect(res.body.data.created_at).to.be.a("string");
    });

    it("should not log a user in with incomplete credentials", async () => {
      const res = await req.post(loginRoute).send(incompleteLoginDetails1);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Please provide a valid email address");
      expect(res.body.status).to.equal("failure");
    });

    it("should not log a user in without email", async () => {
      const res = await req.post(loginRoute).send(incompleteLoginDetails2);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Your missed a required fields: email");
      expect(res.body.status).to.equal("failure");
    });

    it("should not log a user in without password", async () => {
      const res = await req.post(loginRoute).send(incompleteLoginDetails3);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        "Your missed a required fields: password"
      );
      expect(res.body.status).to.equal("failure");
    });

    it("should not log a user in with incorrect credentials", async () => {
      const res = await req.post(loginRoute).send(incorrectLoginDetails1);

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("User does not exist");
    });

    it("should not log a user in with not matching password", async () => {
      const res = await req.post(loginRoute).send(incorrectLoginDetails2);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Invalid credentials");
    });

    it("should not log a user in with not short password length", async () => {
      const res = await req.post(loginRoute).send(incorrectLoginDetails3);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal(
        "Password must be at least eight characters consisting of at least one uppercase, one lowercase, and one number"
      );
    });
  });
});
