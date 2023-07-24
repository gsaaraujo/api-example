import { Either } from '@common/helpers/either';
import { BaseError } from '@common/helpers/base-error';

export abstract class Usecase<I, O> {
  public abstract execute(input?: I): Promise<Either<BaseError, O>>;
}
