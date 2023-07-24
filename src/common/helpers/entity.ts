import { randomUUID } from 'node:crypto';

export abstract class Entity<T> {
  private readonly _id: string;
  protected props: T;

  protected constructor(props: T, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id(): string {
    return this._id;
  }

  public isEquals(entity: Entity<T>): boolean {
    return this._id === entity._id;
  }
}
