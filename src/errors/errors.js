class SMSAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalError extends SMSAPIError {
  constructor(error) {
    super(error.message);
    this.data = { error };
  }
}

export class OperationalError extends SMSAPIError {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

