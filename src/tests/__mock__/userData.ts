import dotenv from "dotenv";

dotenv.config();

const userDetails = {
  completeRegistrationDetails: {
    email: "jake@gmail.com",
    password: "Jakes123",
    first_name: "John",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  completeRegistrationDetailsDuplicate: {
    email: "jake@gmail.com",
    password: "Jakes123",
    first_name: "John",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails1: {
    email: "",
    password: "Jakes123",
    first_name: "James",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails2: {
    email: "jake@gmail.com",
    password: "",
    first_name: "James",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails3: {
    email: "jake@gmail.com",
    password: "Jakes123",
    first_name: "",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails4: {
    email: "jake@gmail.com",
    password: "Jakes123",
    first_name: "James",
    last_name: "",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails5: {
    email: "jake@gmail.com",
    password: "Jakes123",
    first_name: "James",
    last_name: "Snow",
    phone_number: "",
  },

  incompleteRegistrationDetails6: {
    email: "jake@gmail.c",
    password: "Jakes123",
    first_name: "James",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails7: {
    email: "jake@gmail.c",
    password: "Jakes",
    first_name: "James",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails8: {
    email: "jake@gmail.com",
    password: "johnSmith123!",
    first_name: "ja",
    last_name: "Snow",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails9: {
    email: "jake@gmail.com",
    password: "johnSmith123!",
    first_name: "james",
    last_name: "Sn",
    phone_number: "+2347031813378",
  },

  incompleteRegistrationDetails10: {
    email: "jake@gmail.com",
    password: "johnSmith123!",
    first_name: "james",
    last_name: "Snow",
    phone_number: "233071234s5678",
  },

  incompleteRegistrationDetails11: {
    email: "jakj@gmail.com",
    password: "johnSmith123!",
    first_name: "james",
    last_name: "Snow",
    phone_number: "233071234s5678",
    height: "5.5",
  },

  completeLoginDetails: {
    email: "jake@gmail.com",
    password: "Jakes123",
  },

  incompleteLoginDetails1: {
    email: "jake@gmail",
    password: "Jakes123",
  },

  incompleteLoginDetails2: {
    email: "",
    password: "johnSmith123@",
  },

  incompleteLoginDetails3: {
    email: "jake@gmail",
    password: "",
  },

  incorrectLoginDetails1: {
    email: "johns@gmail.com",
    password: "johnSmith123",
  },

  incorrectLoginDetails2: {
    email: "jake@gmail.com",
    password: "Jakes1233",
  },
};

export default userDetails;
