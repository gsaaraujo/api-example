import { BaseError } from '@common/helpers/base-error';
import { ValueObject } from '@common/helpers/value-object';
import { Either, left, right } from '@common/helpers/either';

import { InvalidEmailError } from '@/auth/domain/errors/invalid-email-error';

export type EmailProps = {
  value: string;
};

export class Email extends ValueObject<EmailProps> {
  static create(props: EmailProps): Either<BaseError, Email> {
    const emailPattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;

    if (!emailPattern.test(props.value)) {
      const error = new InvalidEmailError('Email is not a valid email address');
      return left(error);
    }

    const email = new Email(props);
    return right(email);
  }

  static reconstitute(props: EmailProps): Email {
    return new Email(props);
  }

  get value(): string {
    return this.props.value;
  }
}
