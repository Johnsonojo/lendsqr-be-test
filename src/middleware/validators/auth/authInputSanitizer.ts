class AuthInputSanitizer {
  static isValidName(name: string) {
    return name.trim().length > 2;
  }

  static isEmail(email: string) {
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
    return emailRegex.test(email.trim().toLowerCase());
  }

  static isValidPassword(password: string) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password.trim());
  }

  static isValidPhoneNumber(phoneNumber: string) {
    const phoneNumberRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/;
    return phoneNumberRegex.test(phoneNumber.trim());
  }
}

export default AuthInputSanitizer;
