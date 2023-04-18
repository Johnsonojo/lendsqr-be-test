export {};

declare global {
  namespace Express {
    interface Request {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone_number: string;
      payload: object | any;
    }
  }
}
