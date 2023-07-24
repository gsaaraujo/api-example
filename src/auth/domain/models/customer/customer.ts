import { Entity } from '@common/helpers/entity';
import { Either, right } from '@common/helpers/either';
import { BaseError } from '@common/helpers/base-error';

export type CustomerProps = {
  name: string;
  email: string;
  password: string;
};

export class Customer extends Entity<CustomerProps> {
  static create(props: CustomerProps): Either<BaseError, Customer> {
    const customer = new Customer(props);
    return right(customer);
  }

  static reconstitute(id: string, props: CustomerProps): Customer {
    return new Customer(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }
}
