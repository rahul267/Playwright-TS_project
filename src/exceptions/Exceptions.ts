export class FrameworkException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "FrameworkException";
  }
}

export class ValidationException extends FrameworkException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "ValidationException";
  }
}

export class DriverException extends FrameworkException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "DriverException";
  }
}

export class ApiException extends FrameworkException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "ApiException";
  }
}
