export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Unexpected internal error.", {
      cause,
    });

    this.name = "InternalServerError";
    this.action = "Contact the support.";
    this.statusCode = statusCode || 500;
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

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service unavailable now.", {
      cause,
    });

    this.name = "ServiceUnavailableError";
    this.action = "Verify if the service is available.";
    this.statusCode = 503;
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

export class MethodNotAllowed extends Error {
  constructor() {
    super("Method not allowed for this endpoint.");

    this.name = "MethodNotAllowedError";
    this.action = "Verify if the HTTP method is valid to this endpoint.";
    this.statusCode = 405;
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

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "A validation error ocurred.", {
      cause,
    });

    this.name = "ValidationError";
    this.action = action || "Change the data and try again.";
    this.statusCode = 400;
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
