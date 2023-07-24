export abstract class BaseError {
  protected constructor(private readonly _message: string) {}

  get message(): string {
    return this._message;
  }
}
