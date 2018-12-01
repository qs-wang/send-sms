class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalError extends ServerError {
  constructor(error) {
    super(error.message);
    this.data = { error };
  }
}

export class OperationalError extends ServerError {
  constructor(message) {
    super(message);
  }
}

