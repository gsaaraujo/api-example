import { Entity } from '@common/helpers/entity';
import { BaseError } from '@common/helpers/base-error';
import { Either, left, right } from '@common/helpers/either';

import { Email } from '@/auth/domain/models/email';
import { Password } from '@/auth/domain/models/password';
import { InvalidNameError } from '@/auth/domain/errors/invalid-name-error';
import { InvalidPropertyError } from '@/auth/domain/errors/invalid-property-error';

export type CustomerProps = {
  name: string;
  email: Email;
  password: Password;
};

export class Customer extends Entity<CustomerProps> {
  static create(props: CustomerProps): Either<BaseError, Customer> {
    if (typeof props.name !== 'string' || props.name.trim() === '') {
      const error = new InvalidPropertyError('Name must be string and non-empty');
      return left(error);
    }

    const name = props.name.trim();

    if (name.length < 2 || name.length > 50) {
      const error = new InvalidNameError('Name must be between 2 and 50 characters');
      return left(error);
    }

    const customer = new Customer({ ...props, name });
    return right(customer);
  }

  static reconstitute(id: string, props: CustomerProps): Customer {
    return new Customer(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }
}
