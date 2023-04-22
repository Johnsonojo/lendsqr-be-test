const walletDetails = {
  completeWalletDetail: {
    currency: "NGN",
  },
  incorrectWalletDetail1: {
    currency: "",
  },
  incorrectWalletDetail2: {
    currency: "NG",
  },
  completeFundingDetail: {
    amount: 1000,
  },
  incorrectFundingDetail1: {
    amount: "",
  },
  incorrectFundingDetail2: {
    amount: "1000.",
  },
  wrongAccountNumber: 2002876543,
  seededWallet1: {
    id: "56f78b6d-5e8a-4540-87b1-a6cf83032c66",
    currency: "NGN",
    balance: "11000.00",
    account_name: "Johnson Ojo",
    account_number: "5489499737",
    user_id: "ac874981-1658-4a39-86e4-3fe1e91e48be",
  },
  seededWallet2: {
    id: "4eb171f2-d1ba-40d9-946a-5e17a5c9c860",
    currency: "NGN",
    balance: "10000.00",
    account_name: "Vivian Robinson",
    account_number: "4784966734",
    user_id: "ef2d0d89-c523-447d-9f07-473c90726cc1",
  },
  completeTransferDetail1: {
    amount: 1000,
    receiverAccountNumber: 4784966734,
  },
  completeTransferDetail2: {
    amount: 1000,
    receiverAccountNumber: 5489499737,
  },
  incompleteTransferDetail1: {
    amount: "",
    receiverAccountNumber: 4784966734,
  },
  incompleteTransferDetail2: {
    amount: "kj100",
    receiverAccountNumber: 4784966734,
  },
  incompleteTransferDetail3: {
    amount: 1000,
    receiverAccountNumber: "",
  },
  incompleteTransferDetail4: {
    amount: 1000,
    receiverAccountNumber: 20026543,
  },
  inSufficientFundDetail: {
    amount: 100000,
    receiverAccountNumber: 4784966734,
  },
  incorrectFundingNumber: {
    amount: 1000,
    receiverAccountNumber: 2002876543,
  },
  withdrawalOfFundDetail: {
    amount: 1000,
  },
  emptyWithdrawalDetail: {
    amount: "",
  },
  insufficientWithdrawalDetail: {
    amount: 100000,
  },
};

export default walletDetails;
