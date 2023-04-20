class WalletInputSanitizer {
  static isValidCurrency(currency: string) {
    const currencyRegex = /^(NGN|USD)$/;
    return currencyRegex.test(currency.trim());
  }
}

export default WalletInputSanitizer;
