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

  incorrectLoginDetails3: {
    email: "jake@gmail.com",
    password: "Jakes3",
  },

  seededUser: {
    id: "ac874981-1658-4a39-86e4-3fe1e91e48be",
    email: "johnson@test.com",
    password: process.env.GENERAL_PASSWORD,
  },

  expiredToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyZmE5ZDhhLWIxMTQtNGJkYS05MTA0LThlYWMwNWRlNTAwNiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjgxOTMyMzY5LCJleHAiOjE2ODE5MzU5Njl9.jBkAw7LZGBN2CQxh__z5kDWC2ozRszcDiNPt5cLCJkE",

  malformedToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdhNzY5Y2ZmLWMyNWQtNDZiMy05OTc3LTZjMjY2MGUyZTU1NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU2ODI4NDA1LCJleHAiOjE2NTY4Mjg0NjV9.MEGCVn5x0cQCGeG9ESgQWJ4U8EJNetHiuWXaeelZwYa",
};

export default userDetails;
