import { Usecase } from '@common/helpers/usecase';
import { BaseError } from '@common/helpers/base-error';
import { Either, left, right } from '@common/helpers/either';

import { Email } from '@/auth/domain/models/email';
import { Password } from '@/auth/domain/models/password';
import { Customer } from '@/auth/domain/models/customer/customer';
import { ICustomerRepository } from '@/auth/domain/models/customer/customer-repository';

import { AccountAlreadyExistsError } from '@/auth/domain/errors/account-already-exists-error';

export type SignUpUsecaseInput = {
  name: string;
  email: string;
  password: string;
};

export type SignUpUsecaseOutput = void;

export class SignUpUsecase extends Usecase<SignUpUsecaseInput, SignUpUsecaseOutput> {
  public constructor(private readonly customerRepository: ICustomerRepository) {
    super();
  }

  public async execute(input: SignUpUsecaseInput): Promise<Either<BaseError, void>> {
    const validations = [
      Email.create({ value: input.email }),
      Password.create({ value: input.password }),
    ];

    for (const validation of validations) {
      if (validation.isLeft()) return left(validation.value);
    }

    const customerAlreadyExists: boolean = await this.customerRepository.existsByEmail(input.email);

    if (customerAlreadyExists) {
      const error = new AccountAlreadyExistsError(
        'Already exists an account with this email address',
      );
      return left(error);
    }

    const customerOrError: Either<BaseError, Customer> = Customer.create({
      name: input.name,
      email: Email.create({ value: input.email }).value as Email,
      password: Password.create({ value: input.password }).value as Password,
    });

    if (customerOrError.isLeft()) {
      const error: BaseError = customerOrError.value;
      return left(error);
    }

    const customer: Customer = customerOrError.value;
    await this.customerRepository.create(customer);

    return right(undefined);
  }
}
