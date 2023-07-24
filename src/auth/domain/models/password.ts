import crypto from 'node:crypto';

import { BaseError } from '@common/helpers/base-error';
import { ValueObject } from '@common/helpers/value-object';
import { Either, left, right } from '@common/helpers/either';

import { InvalidPasswordError } from '@/auth/domain/errors/invalid-password-error';

export type PasswordProps = {
  salt?: string;
  value: string;
};

export class Password extends ValueObject<PasswordProps> {
  public static create(props: PasswordProps): Either<BaseError, Password> {
    if (props.value.length < 8 || props.value.length > 20) {
      const error = new InvalidPasswordError('Password must be between 8 and 20 characters');
      return left(error);
    }

    const hash = crypto.createHash('sha256');
    const salt = props.salt ?? crypto.randomUUID();

    hash.update(props.value + salt);

    const password = new Password({ salt, value: hash.digest('hex') });
    return right(password);
  }

  public static reconstitute(props: PasswordProps): Password {
    return new Password(props);
  }

  get value(): string {
    return this.props.value;
  }
}
