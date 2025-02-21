export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Unexpected internal error.", {
      cause,
    });

    this.name = "Internal Server Error";
    this.action = "Contact the support.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
