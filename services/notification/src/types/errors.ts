export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class InvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidError";
  }
}
