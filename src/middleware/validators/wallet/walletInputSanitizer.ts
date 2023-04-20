class WalletInputSanitizer {
  static isValidCurrency(currency: string) {
    const currencyRegex = /^(NGN|USD)$/;
    return currencyRegex.test(currency.trim());
  }

  static isValidAmount(amount: number) {
    const amountRegex = /^[1-9]\d*(\.\d+)?$/;
    return amountRegex.test(amount.toString());
  }
}

export default WalletInputSanitizer;
