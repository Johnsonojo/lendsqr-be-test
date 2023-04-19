export {};

declare global {
  namespace Express {
    interface Request {
      payload: object | any;
    }
  }
}
